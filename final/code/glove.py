import numpy as np
import string

stopwords = {"'s","''","``","n't", "--","ourselves", "hers", "between", "yourself", "but", "again", "there", "about", "once", "during", "out", "very", "having", "with", "they", "own", "an", "be", "some", "for", "do", "its", "yours", "such", "into", "of", "most", "itself", "other", "off", "is", "s", "am", "or", "who", "as", "from", "him", "each", "the", "themselves", "until", "below", "are", "we", "these", "your", "his", "through", "don", "nor", "me", "were", "her", "more", "himself", "this", "down", "should", "our", "their", "while", "above", "both", "up", "to", "ours", "had", "she", "all", "no", "when", "at", "any", "before", "them", "same", "and", "been", "have", "in", "will", "on", "does", "yourselves", "then", "that", "because", "what", "over", "why", "so", "can", "did", "not", "now", "under", "he", "you", "herself", "has", "just", "where", "too", "only", "myself", "which", "those", "i", "after", "few", "whom", "t", "being", "if", "theirs", "my", "against", "a", "by", "doing", "it", "how", "further", "was", "here", "than"} | set(string.punctuation)


def is_ascii(s):
    return all(ord(c) < 128 and not c.isdigit() and not c in string.punctuation for c in s)


def loadGloveModel(gloveFile):
    print "Loading Glove Model"
    f = open(gloveFile,'r')
    model = {}
    vectors = []
    keys = []
    for line in f:
        splitLine = line.split()
        word = splitLine[0]
        if word in stopwords or not is_ascii(word):
            continue
        embedding = np.array([float(val) for val in splitLine[1:]])
        model[word] = embedding
        vectors.append(embedding)
        keys.append(word)
    print "Done.",len(model)," words loaded!"
    return model,vectors,keys


