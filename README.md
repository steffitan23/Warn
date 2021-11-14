##WINNER: Boston Hacks Mental Health Track, 2021
## Inspiration

Everyone deserves to feel safe online. But, for better or worse, everything is out there on the internet, including harmful content. **Warn** helps users take control over their well-being by filtering out content that could reawaken trauma. 

## What it does
**Warn** is a browser extension that helps users pick what they want to see on the internet. It currently supports six common triggers that often appear in media: adult content, hate, gambling, substance abuse, visually disturbing content, and violence. When a user loads a webpage, **Warn** checks it for sensitive media, then blocks it out if it's present, without affecting the rest of the page's content. Currently, **Warn** blocks triggering photos, audio, and video.

## How we built it
**Warn** is a Chrome extension, written in pure JavaScript. It is supported by a RESTful API writtent in Python Flask and powered by the AssemblyAI API and AWS Rekognition. 

## Challenges we ran into
Chrome extensions are quite challenging to build compared to a typical web app-- we ran into a lot of deprecated code, blocked functions, and especially CORS issues.

## Accomplishments that we're proud of
We're really proud of how we integrated AssemblyAI into this project. Being able to filter dynamic media, not just images, makes **Warn** far more powerful and useful to users.

## What's next for Warn
We'd like to improve our recognition and add a lot more customization to the extension. Every person is unique, and so we'd like to give everyone options for what they see and what they don't.
