import requests
import os

API_URL = "https://api-inference.huggingface.co/models/Hate-speech-CNERG/bert-base-uncased-hatexplain"

headers = {"Authorization": f"Bearer {os.environ.get('hf_API')}"}

def hate_check(payload):
	response = requests.post(API_URL, headers=headers, json={"inputs": payload})
	return response.json()

def unwanted_words_check(text, unwanted_words):

	def diff(start, goal, tries=0, limit = 5):
		if tries > limit:
			return limit + 1
		if start == "" or goal == "":
			return max(len(start), len(goal)) + tries
		if start[0] == goal[0]:
            # equality is just free replacement
			return diff(start[1:], goal[1:], tries)

		return min(
        	diff(start[1:], goal, tries + 1),  # deletion
            diff(start, goal[1:], tries + 1),  # insertion
            diff(start[1:], goal[1:], tries + 1),  # replacement
            diff(start[2:], goal[2:], tries + 1) #transposition?
        )


	for word in text.split():		
		if word in unwanted_words:
			return True
		for w in unwanted_words:
			if diff(word, w) < 2:
				return True

	return False
