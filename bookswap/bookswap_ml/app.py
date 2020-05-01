from __future__ import print_function
from flask import Flask, escape, request, jsonify


import numpy as np
import pandas as pd
import collections
#from mpl_toolkits.mplot3d import Axes3D
from IPython import display
#from matplotlib import pyplot as plt
import sklearn
import sklearn.manifold
import tensorflow as tf

app = Flask(__name__)



# import tensorflow.compat.v2 as tf
# tf.disable_v2_behavior()

print(tf.__version__)

users_cols = ['user_id']
users = pd.read_csv('processed/u.user', sep='|', names=users_cols, encoding='latin-1')

ratings_cols = ['user_id', 'book_id', 'rating']
ratings = pd.read_csv('processed/u.data', sep='\t', names=ratings_cols, encoding='latin-1')


genre_cols = ['unknown','fiction','fantasy','romance','young-adult',
              'mystery','contemporary','non-fiction','classics','thriller',
              'adult','paranormal','historical','childrens','crime',
              'humor','chick-lit','adventure','horror']

books_cols = ['book_id', 'good_book_id','author','title', "img_url"] + genre_cols
books = pd.read_csv('processed/u.item', sep='|', names=books_cols, encoding='latin-1')

users["user_id"] = users["user_id"].apply(lambda x: str(x-1))
books["book_id"] = books["book_id"].apply(lambda x: str(x-1))
ratings["book_id"] = ratings["book_id"].apply(lambda x: str(x-1))
ratings["user_id"] = ratings["user_id"].apply(lambda x: str(x-1))
genre_occurences = books[genre_cols].sum().to_dict()

def mark_genres(books, genres):
  def get_random_genre(gs):
    active = [genre for genre, g in zip(genres, gs) if g==1]
    if len(active) == 0:
      return 'Other'
    return np.random.choice(active)
  def get_all_genres(gs):
    active = [genre for genre, g in zip(genres, gs) if g==1]
    if len(active) == 0:
      return 'Other'
    return '-'.join(active)
  books['genre'] = [
      get_random_genre(gs) for gs in zip(*[books[genre] for genre in genres])]
  books['all_genres'] = [
      get_all_genres(gs) for gs in zip(*[books[genre] for genre in genres])]

mark_genres(books, genre_cols)

def split_dataframe(df, holdout_fraction=0.1):
  """Splits a DataFrame into training and test sets.
  Args:
    df: a dataframe.
    holdout_fraction: fraction of dataframe rows to use in the test set.
  Returns:
    train: dataframe for training
    test: dataframe for testing
  """
  test = df.sample(frac=holdout_fraction, replace=False)
  train = df[~df.index.isin(test.index)]
  return train, test

#users.describe()

def build_rating_sparse_tensor(ratings_df):
  """
  Args:
    ratings_df: a pd.DataFrame with `user_id`, `book_id` and `rating` columns.
  Returns:
    a tf.SparseTensor representing the ratings matrix.
  """
  indices = ratings_df[['user_id', 'book_id']].values
  values = ratings_df['rating'].values
#     users.shape[0] = 53424
  return tf.SparseTensor(
      indices=indices,
      values=values,
      dense_shape=[users.shape[0], books.shape[0]])

def sparse_mean_square_error(sparse_ratings, user_embeddings, book_embeddings):
  """
  Args:
    sparse_ratings: A SparseTensor rating matrix, of dense_shape [N, M]
    user_embeddings: A dense Tensor U of shape [N, k] where k is the embedding
      dimension, such that U_i is the embedding of user i.
    book_embeddings: A dense Tensor V of shape [M, k] where k is the embedding
      dimension, such that V_j is the embedding of book j.
  Returns:
    A scalar Tensor representing the MSE between the true ratings and the
      model's predictions.
  """
  predictions = tf.reduce_sum(
      tf.gather(user_embeddings, sparse_ratings.indices[:, 0]) *
      tf.gather(book_embeddings, sparse_ratings.indices[:, 1]),
      axis=1)
  loss = tf.losses.mean_squared_error(sparse_ratings.values, predictions)
  return loss

class CFModel(object):
  """Simple class that represents a collaborative filtering model"""
  def __init__(self, embedding_vars, loss, metrics=None):
    """Initializes a CFModel.
    Args:
      embedding_vars: A dictionary of tf.Variables.
      loss: A float Tensor. The loss to optimize.
      metrics: optional list of dictionaries of Tensors. The metrics in each
        dictionary will be plotted in a separate figure during training.
    """
    self._embedding_vars = embedding_vars
    self._loss = loss
    self._metrics = metrics
    self._embeddings = {k: None for k in embedding_vars}
    self._session = None

  @property
  def embeddings(self):
    """The embeddings dictionary."""
    return self._embeddings
        

  def train(self, num_iterations=100, learning_rate=1.0, plot_results=False,
            optimizer=tf.train.GradientDescentOptimizer):
    """Trains the model.
    Args:
      iterations: number of iterations to run.
      learning_rate: optimizer learning rate.
      plot_results: whether to plot the results at the end of training.
      optimizer: the optimizer to use. Default to GradientDescentOptimizer.
    Returns:
      The metrics dictionary evaluated at the last iteration.
    """
    with self._loss.graph.as_default():
      opt = optimizer(learning_rate)
      train_op = opt.minimize(self._loss)
      local_init_op = tf.group(
          tf.variables_initializer(opt.variables()),
          tf.local_variables_initializer())
      if self._session is None:
        self._session = tf.Session()
        with self._session.as_default():
          self._session.run(tf.global_variables_initializer())
          self._session.run(tf.tables_initializer())
          tf.train.start_queue_runners()

    with self._session.as_default():
      local_init_op.run()
      iterations = []
      metrics = self._metrics or ({},)
      metrics_vals = [collections.defaultdict(list) for _ in self._metrics]

      # Train and append results.
      for i in range(num_iterations + 1):
        _, results = self._session.run((train_op, metrics))
        if (i % 10 == 0) or i == num_iterations:
          print("\r iteration %d: " % i + ", ".join(
                ["%s=%f" % (k, v) for r in results for k, v in r.items()]),
                end='')
          iterations.append(i)
          for metric_val, result in zip(metrics_vals, results):
            for k, v in result.items():
              metric_val[k].append(v)

      for k, v in self._embedding_vars.items():
        self._embeddings[k] = v.eval()

      # if plot_results:
      #   # Plot the metrics.
      #   num_subplots = len(metrics)+1
      #   fig = plt.figure()
      #   fig.set_size_inches(num_subplots*10, 8)
      #   for i, metric_vals in enumerate(metrics_vals):
      #     ax = fig.add_subplot(1, num_subplots, i+1)
      #     for k, v in metric_vals.items():
      #       ax.plot(iterations, v, label=k)
      #     ax.set_xlim([1, num_iterations])
      #     ax.legend()
      return results


def gravity(U, V):
  """Creates a gravity loss given two embedding matrices."""
  return 1. / (U.shape[0].value*V.shape[0].value) * tf.reduce_sum(
      tf.matmul(U, U, transpose_a=True) * tf.matmul(V, V, transpose_a=True))

def build_regularized_model(
    ratings, embedding_dim=3, regularization_coeff=.1, gravity_coeff=1.,
    init_stddev=0.1):
  """
  Args:
    ratings: the DataFrame of book ratings.
    embedding_dim: The dimension of the embedding space.
    regularization_coeff: The regularization coefficient lambda.
    gravity_coeff: The gravity regularization coefficient lambda_g.
  Returns:
    A CFModel object that uses a regularized loss.
  """
  # Split the ratings DataFrame into train and test.
  train_ratings, test_ratings = split_dataframe(ratings)
  # SparseTensor representation of the train and test datasets.
  A_train = build_rating_sparse_tensor(train_ratings)
  A_test = build_rating_sparse_tensor(test_ratings)
  U = tf.Variable(tf.random_normal(
      [A_train.dense_shape[0], embedding_dim], stddev=init_stddev))
  V = tf.Variable(tf.random_normal(
      [A_train.dense_shape[1], embedding_dim], stddev=init_stddev))

  error_train = sparse_mean_square_error(A_train, U, V)
  error_test = sparse_mean_square_error(A_test, U, V)
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

  return CFModel(embeddings, total_loss, [losses, loss_components])


reg_model = build_regularized_model(
    ratings, regularization_coeff=0.1, gravity_coeff=1.0, embedding_dim=35,
    init_stddev=.05)
reg_model.train(num_iterations=20, learning_rate=20.)

DOT = 'dot'
COSINE = 'cosine'
def compute_scores(query_embedding, item_embeddings, measure=DOT):
  """Computes the scores of the candidates given a query.
  Args:
    query_embedding: a vector of shape [k], representing the query embedding.
    item_embeddings: a matrix of shape [N, k], such that row i is the embedding
      of item i.
    measure: a string specifying the similarity measure to be used. Can be
      either DOT or COSINE.
  Returns:
    scores: a vector of shape [N], such that scores[i] is the score of item i.
  """
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

def book_neighbors(model, title_substring, measure=DOT, k=6):
  # Search for book ids that match the given substring.
  ids =  books[books['title'].str.contains(title_substring)].index.values
  titles = books.iloc[ids]['title'].values
  if len(titles) == 0:
    raise ValueError("Found no book with title %s" % title_substring)
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
      'genres': books['all_genres']
  })
  display.display(df.sort_values([score_key], ascending=False).head(k))
  return (df.sort_values([score_key], ascending=False).head(k))


user_recommendations(reg_model, DOT, exclude_rated=True, k=10)

book_neighbors(reg_model, "The Kite Runner", DOT)
book_neighbors(reg_model, "The Kite Runner", COSINE)



@app.route('/')
def hello():
    name = request.args.get("name", "Test")
    return f'Hello, {escape(name)}!'


@app.route('/predictions/<string:bookname>', methods=["GET"])
def getPredictions(bookname):
	pred1 = book_neighbors(reg_model, bookname, DOT)
	pred2 = book_neighbors(reg_model, bookname, COSINE)
	return (pred1.to_json(orient='index'))
