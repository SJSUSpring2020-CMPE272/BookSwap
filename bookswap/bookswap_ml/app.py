from __future__ import print_function
from flask import Flask, escape, request, jsonify


import numpy as np
import pandas as pd
import collections
from IPython import display
import sklearn
import sklearn.manifold
import tensorflow as tf

app = Flask(__name__)
pd.set_option('display.max_rows', None)

print("Reading data")
users_cols = ['user_id']
users = pd.read_csv('data/user_info', sep='|', names=users_cols, encoding='latin-1')

ratings_cols = ['user_id', 'book_id', 'rating']
ratings = pd.read_csv('data/ratings_info', sep='\t', names=ratings_cols, encoding='latin-1')


genre_cols = ['unknown','fiction','fantasy','romance','young-adult',
              'mystery','contemporary','non-fiction','classics','thriller',
              'adult','paranormal','historical','childrens','crime',
              'humor','chick-lit','adventure','horror']

books_cols = ['book_id', 'good_book_id','author','title', "img_url"] + genre_cols
books = pd.read_csv('data/book_info', sep='|', names=books_cols, encoding='latin-1')

processed_title=[]
for name in books['title']:
  name = name.lower()
  if not (name.isalnum()):
    name = ''.join(e for e in name if e.isalnum())
  processed_title.append(name)
books['edited_title'] = processed_title
  

users["user_id"] = users["user_id"].apply(lambda x: str(x-1))
books["book_id"] = books["book_id"].apply(lambda x: str(x-1))
ratings["book_id"] = ratings["book_id"].apply(lambda x: str(x-1))
ratings["user_id"] = ratings["user_id"].apply(lambda x: str(x-1))
genre_occurences = books[genre_cols].sum().to_dict()

def select_genres(books, genres):
  def get_genres(gn):
    present = [genre for genre, g in zip(genres, gn) if g==1]
    if len(present) == 0:
      return 'Other'
    return '-'.join(present)

  books['all_genres'] = [
      get_genres(gn) for gn in zip(*[books[genre] for genre in genres])]

select_genres(books, genre_cols)

def divide_train_test(df, test_fraction=0.001):
  
  test = df.sample(frac=test_fraction, replace=False)
  train = df[~df.index.isin(test.index)]
  return train, test

def get_matrix_from_ratings(ratings_df):
  
  cols = ratings_df[['user_id', 'book_id']].values
  rows = ratings_df['rating'].values
  return tf.SparseTensor(
      indices=cols,
      values=rows,
      dense_shape=[users.shape[0], books.shape[0]])

def calculate_mean_error(sparse_ratings, user_embeddings, book_embeddings):
  
  predictions = tf.reduce_sum(
      tf.gather(user_embeddings, sparse_ratings.indices[:, 0]) *
      tf.gather(book_embeddings, sparse_ratings.indices[:, 1]),
      axis=1)
  loss = tf.losses.mean_squared_error(sparse_ratings.values, predictions)
  return loss

class Collab_Filter_Model(object):
  def __init__(self, embedding_vars, loss, metrics=None):
    
    self.embedding_vars = embedding_vars
    self.loss = loss
    self.metrics = metrics
    self._embeddings = {k: None for k in embedding_vars}
    self.session = None

  @property
  def embeddings(self):
    return self._embeddings
        

  def train_data(self, number_of_iterations=100, lr=1.0, 
            optimizer=tf.train.GradientDescentOptimizer):
    
    with self.loss.graph.as_default():
      opt = optimizer(lr)
      training_optimizer = opt.minimize(self.loss)
      initialise_local = tf.group(
          tf.variables_initializer(opt.variables()),
          tf.local_variables_initializer())
      if self.session is None:
        self.session = tf.Session()
        with self.session.as_default():
          self.session.run(tf.global_variables_initializer())
          self.session.run(tf.tables_initializer())
          tf.train.start_queue_runners()

    with self.session.as_default():
      initialise_local.run()
      iterations_count = []
      metrics = self.metrics or ({},)
      metrics_vals = [collections.defaultdict(list) for _ in self.metrics]

     
      for i in range(number_of_iterations + 1):
        _, results = self.session.run((training_optimizer, metrics))
        if (i % 10 == 0) or i == number_of_iterations:
          print("\r iteration %d: " % i + ", ".join(
                ["%s=%f" % (k, v) for r in results for k, v in r.items()]),
                end='')
          iterations_count.append(i)
          for metric_val, result in zip(metrics_vals, results):
            for k, v in result.items():
              metric_val[k].append(v)

      for k, v in self.embedding_vars.items():
        self._embeddings[k] = v.eval()

      return results


def create_gravity_loss(col_u, col_v):
  return 1. / (col_u.shape[0].value*col_v.shape[0].value) * tf.reduce_sum(
      tf.matmul(col_u, col_u, transpose_a=True) * tf.matmul(col_v, col_v, transpose_a=True))

def create_reglr_model(
    ratings, embed_dimension=3, regn_coeffient=.1, grav_coefficient=1.,
    standard_dev=0.1):
  
  train_ratings, test_ratings = divide_train_test(ratings)
  
  train_sample = get_matrix_from_ratings(train_ratings)
  test_sample = get_matrix_from_ratings(test_ratings)
  col_u = tf.Variable(tf.random_normal(
      [train_sample.dense_shape[0], embed_dimension], stddev=standard_dev))
  col_v = tf.Variable(tf.random_normal(
      [train_sample.dense_shape[1], embed_dimension], stddev=standard_dev))

  trn_error = calculate_mean_error(train_sample, col_u, col_v)
  tst_error = calculate_mean_error(test_sample, col_u, col_v)
  gr_loss = grav_coefficient * create_gravity_loss(col_u, col_v)
  reglrn_loss = regn_coeffient * (
      tf.reduce_sum(col_u*col_u)/col_u.shape[0].value + tf.reduce_sum(col_v*col_v)/col_v.shape[0].value)
  tot_loss = trn_error + reglrn_loss + gr_loss
  losses = {
      'train_error_observed': trn_error,
      'test_error_observed': tst_error,
  }
  loss_components = {
      'observed_loss': trn_error,
      'regularization_loss': reglrn_loss,
      'gravity_loss': gr_loss,
  }
  embeddings = {"user_id": col_u, "book_id": col_v}
  print(tot_loss)
  print(losses)
  print(loss_components)

  return Collab_Filter_Model(embeddings, tot_loss, [losses, loss_components])


my_regular_model = create_reglr_model(
    ratings, regn_coeffient=0.1, grav_coefficient=1.0, embed_dimension=35,
    standard_dev=.05)
my_regular_model.train_data(number_of_iterations=2000, lr=20.)

DOT = 'dot'
COSINE = 'cosine'
def compute_scores(query_embedding, item_embedding, measure_method=DOT):
  
  query_u = query_embedding
  item_v = item_embedding
  if measure_method == COSINE:
    item_v = item_v / np.linalg.norm(item_v, axis=1, keepdims=True)
    query_u = query_u / np.linalg.norm(query_u)
  scores = query_u.dot(item_v.T)
  return scores

def get_book_predictions(model, substring_of_bookname, measure_method=DOT, k=10):
 
  substring_of_bookname = substring_of_bookname.lower()
  substring_of_bookname = ''.join(e for e in substring_of_bookname if e.isalnum())

  temp = books['edited_title'].str.contains(substring_of_bookname)
  ids =  books[temp].index.values
  titles = books.iloc[ids]['title'].values
  if len(titles) == 0:
    raise ValueError("Found no books with title %s" % substring_of_bookname)
  print("Nearest neighbors of : %s." % titles[0])
  if len(titles) > 1:
    print("[Found more than one matching book. Other candidates: {}]".format(
        ", ".join(titles[1:])))
  book_id = ids[0]
  scores = compute_scores(
      model.embeddings["book_id"][book_id], model.embeddings["book_id"],
      measure_method)
  calculated_score = measure_method + ' score'
  df = pd.DataFrame({
      calculated_score: list(scores),
      'titles': books['title'],
      'genres': books['all_genres'],
      'image_url': books['img_url']
  })
  display.display(df.sort_values([calculated_score], ascending=False).head(k))
  return (df.sort_values([calculated_score], ascending=False).head(k))


@app.route('/')
def hello():
    name = request.args.get("name", "Test")
    return f'Hello, {escape(name)}!'


@app.route('/predictions/<string:bookname>', methods=["GET"])
def getPredictions(bookname):
  pred1 = get_book_predictions(my_regular_model, bookname, COSINE)
  pred2 = get_book_predictions(my_regular_model, bookname, DOT)

  return (pred1.to_json(orient='index'))
