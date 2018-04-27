import numpy as np
import sklearn
import kmapper as km
import string
from glove import loadGloveModel




def projectWords(gloveFile, destination, n_components, perplexity, n_vectors, writeVectors):
    model,vectors,keys = loadGloveModel(gloveFile)
    mapper = km.KeplerMapper(verbose=2)
    np.savetxt(destination + "word-vectors" + "-c" + str(n_vectors) + ".csv", vectors[0:n_vectors], delimiter=',')
    subset = np.array(vectors[0:n_vectors])
    subsetKeys = keys[0:n_vectors]
    if writeVectors:
        thefile = open(destination + 'words' + str(n_vectors) + ".csv", 'w')
        for item in subsetKeys:
            thefile.write("%s\n" % item)
    print "projecting"
    projected_data = mapper.fit_transform(subset,
                                      projection=sklearn.manifold.TSNE(n_components=n_components, perplexity=perplexity))
    if writeVectors:
        print "saving vectors"
        np.savetxt(destination + "tsne-vectors" + "-nc" + str(n_components) + "-p" + str(perplexity) + "-c" + str(n_vectors) + ".csv", projected_data, delimiter=',')
    return subsetKeys, projected_data 

def projectWordsNoFile(vectors, keys, destination, n_components, perplexity, n_vectors, writeVectors):
    mapper = km.KeplerMapper(verbose=2)
    np.savetxt(destination + "word-vectors" + "-c" + str(n_vectors) + ".csv", vectors[0:n_vectors], delimiter=',')
    subset = np.array(vectors[0:n_vectors])
    subsetKeys = keys[0:n_vectors]
    if writeVectors:
        thefile = open(destination + 'words' + str(n_vectors) + ".csv", 'w')
        for item in subsetKeys:
            thefile.write("%s\n" % item)
    print "projecting"
    projected_data = mapper.fit_transform(subset,
                                      projection=sklearn.manifold.TSNE(n_components=n_components, perplexity=perplexity))
    if writeVectors:
        print "saving vectors"
        np.savetxt(destination + "tsne-vectors" + "-nc" + str(n_components) + "-p" + str(perplexity) + "-c" + str(n_vectors) + ".csv", projected_data, delimiter=',')
    return subsetKeys, projected_data    

def projectWordsNoFileDoubleProject(vectors, keys, destination, n_components, perplexity, n_vectors, writeVectors, n_components_2nd):
    mapper = km.KeplerMapper(verbose=2)
    np.savetxt(destination + "word-vectors" + "-c" + str(n_vectors) + ".csv", vectors[0:n_vectors], delimiter=',')
    subset = np.array(vectors[0:n_vectors])
    subsetKeys = keys[0:n_vectors]
    if writeVectors:
        thefile = open(destination + 'words' + str(n_vectors) + ".csv", 'w')
        for item in subsetKeys:
            thefile.write("%s\n" % item)
    print "projecting"
    projected_data = mapper.fit_transform(subset,
                                      projection=sklearn.manifold.TSNE(n_components=n_components, perplexity=perplexity))

    projected_data2 = mapper.fit_transform(subset, projection=sklearn.manifold.TSNE(n_components=n_components_2nd, perplexity=perplexity))
    if writeVectors:
        print "saving vectors"
        np.savetxt(destination + "tsne-vectors" + "-nc" + str(n_components) + "-p" + str(perplexity) + "-c" + str(n_vectors) + ".csv", projected_data, delimiter=',')
        np.savetxt(destination + "tsne-vectors" + "-nc" + str(n_components_2nd) + "-p" + str(perplexity) + "-c" + str(n_vectors) + ".csv", projected_data2, delimiter=',')
    return subsetKeys, projected_data    


# keys,vectors = projectWords("../data/glove.txt", "../website/data/", 2, 40.0, 5000, True)










# print "saving keys"
# np.savetxt("words.csv", subsetKeys, delimiter=',')

#print projected_data[0:10]

# graph = mapper.map(projected_data,
#                    subset,
#                    clusterer=sklearn.cluster.DBSCAN(eps=1.0, min_samples=60),
#                    nr_cubes=5, overlap_perc=1.0)
#                    #nr_cubes -> # of intervals in the filter function
#                    #overlap -> overlap of intervals

# mapper.visualize(graph,
#                 path_html="words.html",
#                 custom_tooltips=subsetKeys)

# # Default lens: sum
# lens = mapper.fit_transform(data)

# graph = mapper.map(lens,
#                    data,
#                    clusterer=sklearn.cluster.DBSCAN(eps=0.1, min_samples=5),
#                    nr_cubes=15, overlap_perc=0.2)

# mapper.visualize(graph,
#                 path_html="words.html")

# You may want to visualize the original point cloud data in 3D scatter too

# import matplotlib.pyplot as plt
# from mpl_toolkits.mplot3d import Axes3D

# fig = plt.figure()
# ax = fig.add_subplot(111, projection='3d')
# ax.scatter(data[:,0],data[:,1],data[:,2])
# plt.savefig("bunny.csv.png")
# plt.show()


