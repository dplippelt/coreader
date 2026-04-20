# CoReader

A prototype e-reader app for practicing reading comprehension with immersive background music.


## Summary

CoReader is an app I designed after hearing that reading comprehension skills are dropping in young adults. The app currently contains two public domain books obtained through the Gutenberg Project: Dracula by Bram Stoker and Frankenstein by Mary Wollstonecraft Shelley. After each chapter the user is presented with 5 comprehension questions that test their understanding of the chapter they just read. The user can choose to use a set of pre-generated questions or have an LLM generate a new set of questions for each new chapter.
Additionally, each chapter is accompanied by matching background music to increase reading immersion and enjoyment. NB: this part is a work in progress as not all chapters have been matched with a specific music track yet. For those chapters is currently defaults to the music used for chapter 1. Furthermore, Frankenstein currently uses the same music per chapter as Dracula.


## Features

- Two books available for reading: Dracula by Bram Stoker and Frankenstein by Mary Wollstonecraft Shelley
- Chapter navigation menu
- Reading comprehension questions (pick between static and dynamically generated questions)
- Option to clear previously generated questions to receive a new set of questions
- Immersive background music with music controls
- Customizable font size
- Questions and music can be toggled on and off in the app's settings


## Tech stack

I used React with TypeScript as my frontend framework and Vite to host the app. I chose React as my frontend framework because it ... [easy to build using their components and hooks approach, is a much used industry standard, allows writing code programmatically / more similar to functional programming, great control and flexibility, was great entrypoint for me into frontend coding, I also looked at Svelte but preferred React as Svelte's approach hides more of the functionality and feels like 'magic' / too much blackbox stuff]. I combined it with TypeScript [as typing makes code easier to read, debug and less prone to errors and bugs slipping in unnoticed].
For hosting the site I chose Vite because .. [I have no clue.. it's just easy to use and set up, deployment is synced with my github pushes.. nice and easy, and free hosting, perfect for a dev project].


## App Architecture

### Styling

I prefer to keep my CSS styling in separate files instead of inline with the component logic. However, I quickly ran into naming collisions between similar elements across different files. By using CSS Modules, class names are scoped to their accompanying files automatically without having to worry about accidental overlap in class names.
