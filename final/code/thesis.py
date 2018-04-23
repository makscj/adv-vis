import unittest
import datamuse
from datamuse import Datamuse
from glove import loadGloveModel
import Queue
import unicodedata
from tsne import projectWordsNoFile
import numpy as np

dm = Datamuse()



model,vectors,keys = loadGloveModel("../data/glove.6B.50d.txt")

# print keys[0:100]

cryptic = ['mother','ordered','sail','fabrics','materials']


crypticKeys = []
crypticVectors = []
crypticModel = {}
crypticNeighbors = {}
neighborsForFile = []

neighborDepth = 3
maxNeighbors = 10


q = Queue.Queue()

queried = []

for k in cryptic:
    q.put((k,0))


while q.qsize() > 0:
    current,level = q.get()
    print current,level,q.qsize()
    if level < neighborDepth:
        if current in keys:
            crypticKeys.append(current)
            v = model[current]
            crypticVectors.append(v)
            crypticModel[current] = v
            if current not in queried:
                args = {'ml': current, 'max': maxNeighbors}
                queried.append(current)
                neighbors = [unicodedata.normalize('NFKD',item['word']).encode('ascii','ignore')\
                            for item in dm.words(**args)]
                crypticNeighbors[current] = neighbors
                nextLevel = level + 1
                for n in neighbors:
                    neighborsForFile.append([current, n])
                    q.put((n,nextLevel))

print crypticKeys
print "---"    
# print crypticVectors
# print crypticModel
print neighborsForFile

destination = "../data/"

np.savetxt(destination + "neighbors" +\
         "-depth" + str(neighborDepth) +\
          "-max" + str(maxNeighbors) + \
          "-c" + str(len(crypticKeys)) + ".csv",\
           neighborsForFile, delimiter=',', fmt="%s")


projectWordsNoFile(crypticVectors, crypticKeys, "../website/data/", 2, 40.0, len(crypticKeys), True)

