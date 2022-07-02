export interface Todo {
  id: string
  storyTitle: string
  mediaFiles?: mediaFile[]
}

interface mediaFile{
  mediaPath: string
  format: string
}