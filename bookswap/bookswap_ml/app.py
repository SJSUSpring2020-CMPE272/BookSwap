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
  """Simple class that represents a collaborative filtering model"""
  def __init__(self, embedding_vars, loss, metrics=None):
    
    self.embedding_vars = embedding_vars
    self.loss = loss
    self.metrics = metrics
    self._embeddings = {k: None for k in embedding_vars}
    self.session = None

  @property
  def embeddings(self):
    """The embeddings dictionary."""
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


def gravity(U, V):
  """Creates a gravity loss given two embedding matrices."""
  return 1. / (U.shape[0].value*V.shape[0].value) * tf.reduce_sum(
      tf.matmul(U, U, transpose_a=True) * tf.matmul(V, V, transpose_a=True))

def build_regularized_model(
    ratings, embedding_dim=3, regularization_coeff=.1, gravity_coeff=1.,
    init_stddev=0.1):
  
  train_ratings, test_ratings = divide_train_test(ratings)
  
  # SparseTensor representation of the train and test datasets.
  A_train = get_matrix_from_ratings(train_ratings)
  A_test = get_matrix_from_ratings(test_ratings)
  U = tf.Variable(tf.random_normal(
      [A_train.dense_shape[0], embedding_dim], stddev=init_stddev))
  V = tf.Variable(tf.random_normal(
      [A_train.dense_shape[1], embedding_dim], stddev=init_stddev))

  error_train = calculate_mean_error(A_train, U, V)
  error_test = calculate_mean_error(A_test, U, V)
  gravity_loss = gravity_coeff * gravity(U, V)
  regularization_loss = regularization_coeff * (
      tf.reduce_sum(U*U)/U.shape[0].value + tf.reduce_sum(V*V)/V.shape[0].value)
  total_loss = error_train + regularization_loss + gravity_loss
  losses = {
      'train_error_observed': error_train,
      'test_error_observed': error_test,
  }
  loss_components = {
      'observed_loss': error_train,
      'regularization_loss': regularization_loss,
      'gravity_loss': gravity_loss,
  }
  embeddings = {"user_id": U, "book_id": V}
  print(total_loss)
  print(losses)
  print(loss_components)

  return Collab_Filter_Model(embeddings, total_loss, [losses, loss_components])


reg_model = build_regularized_model(
    ratings, regularization_coeff=0.1, gravity_coeff=1.0, embedding_dim=35,
    init_stddev=.05)
reg_model.train_data(number_of_iterations=2000, lr=20.)

DOT = 'dot'
COSINE = 'cosine'
def compute_scores(query_embedding, item_embeddings, measure=DOT):
  
  u = query_embedding
  V = item_embeddings
  if measure == COSINE:
    V = V / np.linalg.norm(V, axis=1, keepdims=True)
    u = u / np.linalg.norm(u)
  scores = u.dot(V.T)
  return scores

def user_recommendations(model, measure=DOT, exclude_rated=False, k=6):
  if False:
    scores = compute_scores(
        model.embeddings["user_id"][53424], model.embeddings["book_id"], measure)
    score_key = measure + ' score'
    df = pd.DataFrame({
        score_key: list(scores),
        'book_id': books['book_id'],
        'titles': books['title'],
        'genres': books['all_genres'],
    })
    if exclude_rated:
      # remove books that are already rated
      rated_books = ratings[ratings.user_id == "53424"]["book_id"].values
      df = df[df.book_id.apply(lambda book_id: book_id not in rated_books)]
    display.display(df.sort_values([score_key], ascending=False).head(k))  


def book_neighbors(model, title_substring, measure=DOT, k=10):
  # Search for book ids that match the given substring.

  title_substring = title_substring.lower()
  title_substring = ''.join(e for e in title_substring if e.isalnum())

  temp = books['edited_title'].str.contains(title_substring)
  ids =  books[temp].index.values
  titles = books.iloc[ids]['title'].values
  if len(titles) == 0:
    raise ValueError("Found no books with title %s" % title_substring)
  print("Nearest neighbors of : %s." % titles[0])
  if len(titles) > 1:
    print("[Found more than one matching book. Other candidates: {}]".format(
        ", ".join(titles[1:])))
  book_id = ids[0]
  scores = compute_scores(
      model.embeddings["book_id"][book_id], model.embeddings["book_id"],
      measure)
  score_key = measure + ' score'
  df = pd.DataFrame({
      score_key: list(scores),
      'titles': books['title'],
      'genres': books['all_genres'],
      'image_url': books['img_url']
  })
  display.display(df.sort_values([score_key], ascending=False).head(k))
  return (df.sort_values([score_key], ascending=False).head(k))


user_recommendations(reg_model, DOT, exclude_rated=True, k=10)

# book_neighbors(reg_model, "Harry Potter", DOT)
# book_neighbors(reg_model, "Harry Potter", COSINE)



@app.route('/')
def hello():
    name = request.args.get("name", "Test")
    return f'Hello, {escape(name)}!'


@app.route('/predictions/<string:bookname>', methods=["GET"])
def getPredictions(bookname):
  # print("Rquesting recomendation for: " + bookname)
  # bookname = bookname.lower()
  # if not (bookname.isalnum()):
  #   bookname = ''.join(e for e in bookname if e.isalnum())
  # print("Bookname after formatting: " + bookname)

  # df = books[books['edited_title'].astype(str).str.contains(bookname)]
  # if df.empty == True:
  #   new_dict ={}
  #   new_dict['title'] = "No book in dataset"
  #   return jsonify(new_dict)

  # print("Found matching book with name: " + df.iloc[0]['title'])
  pred1 = book_neighbors(reg_model, bookname, COSINE)
  pred2 = book_neighbors(reg_model, bookname, DOT)

  return (pred1.to_json(orient='index'))
