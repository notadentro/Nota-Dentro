import { Lesson } from './lesson';

export interface Trail {
  id: string;
  title: string;
  description: string;
  icon: string;
  courses: Course[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  author: string;
  lessons: Lesson[];
}
