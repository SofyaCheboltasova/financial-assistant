import nltk, pymorphy2, re
from nltk.corpus import stopwords

def remove_punctuation(text):
    text = re.sub(r'\*+', '', text)
    return text

def remove_stop_words(tokens):
    stop_words = set(stopwords.words('russian'))
    tagged_tokens = nltk.pos_tag(tokens, lang='rus')
    filtered_tokens = [word for word, tag in tagged_tokens if tag not in ['CONJ', 'PR', 'ADV'] and word.lower() not in stop_words]
    
    lemmas = [nltk.stem.WordNetLemmatizer().lemmatize(t) for t in filtered_tokens]
    return lemmas

def to_nominative_case(words):
    morph = pymorphy2.MorphAnalyzer()
    nominative_words = []
    for word in words:
        parsed_word = morph.parse(word)[0] 
        inflected_word = parsed_word.inflect({'nomn'})
        nominative_word = inflected_word.word if inflected_word else word 
        nominative_words.append(nominative_word)
    return nominative_words

def preprocessing(string):
  tokens = nltk.word_tokenize(string)
  lemmas = remove_stop_words(tokens)
  nom_lemmas = to_nominative_case(lemmas)
  preprocessed = ' '.join(nom_lemmas)
  cleaned_text = remove_punctuation(preprocessed)
  return cleaned_text