from glove import loadGloveModel
import string
from nltk.corpus import wordnet
import json

# import nltk
# nltk.download('wordnet')


model,vectors,keys = loadGloveModel("../data/glove.txt")




size = 5000
words = keys[0:size]

similarity = {}


for word in words:
    similarity[word] = {}



print "Computing similarity"

counter = 0

for word1 in words:
    if counter % 1000 == 0:
        print counter, "complete"
    for word2 in words:
        if word1 != word2:
            wordFromList1 = wordnet.synsets(word1)
            wordFromList2 = wordnet.synsets(word2)
            if wordFromList1 and wordFromList2:
                s = wordFromList1[0].wup_similarity(wordFromList2[0])
                if s == None:
                    continue
                similarity[word1][word2] = s
                similarity[word2][word1] = s
    counter += 1

print "Writing to file"
with open('../website/data/wordnet-similarity-' + str(size) + ".json", 'w') as outfile:
    json.dump(similarity, outfile)
        

