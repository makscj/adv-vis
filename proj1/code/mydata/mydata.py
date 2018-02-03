import numpy as np
import sklearn
import kmapper as km
import json

data = np.genfromtxt('mydata.csv',delimiter=',',skip_header=1, usecols=[i for i in range(1,8)], dtype=float)

labels = np.genfromtxt('mydata.csv', delimiter=',',skip_header=1, usecols=0, dtype=str)


with open('song-title.json', 'r') as f:
    names = json.load(f)

idToName = {}

for obj in names:
    idToName[obj["id"]] = "[" + obj["name"] + " by " + obj["artist"] + "]"

titles = np.array([idToName[x].encode("utf8") + '\n' for x in labels])

print titles[1:4]

mapper = km.KeplerMapper(verbose=2)

"""
n_components=3
perplexity=40.0
eps=0.4
min_samples=15
nr_cubes=15
overlap_perc=0.5

n_components=2
perplexity=30.0
eps=0.6
min_samples=15
nr_cubes=15
overlap_perc=0.5

n_components=2
perplexity=40.0
eps=0.3
min_samples=10
nr_cubes=20
overlap_perc=0.2

kmeans
n_components=2
perplexity=30.0
n_clusters = 2
nr_cubes=20
overlap_perc=0.2
"""

projected_data = mapper.fit_transform(data,
                                      projection=sklearn.manifold.TSNE(n_components=2, perplexity=40.0))

graph = mapper.map(projected_data,
                   data,
                   clusterer=sklearn.cluster.DBSCAN(eps=0.3, min_samples=10),
                   nr_cubes=20, overlap_perc=0.2)
                   #nr_cubes -> # of intervals in the filter function
                   #overlap -> overlap of intervals

mapper.visualize(graph,
                path_html="music_vis_3.html",
                custom_tooltips=titles)

# You may want to visualize the original point cloud data in 3D scatter too
"""
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
ax.scatter(data[:,0],data[:,1],data[:,2])
plt.savefig("cat-reference.csv.png")
plt.show()
"""

