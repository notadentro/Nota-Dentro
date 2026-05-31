import React from 'react';
import { notFound } from 'next/navigation';
import { DATABASE } from '@/constants/curriculum';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CourseMapWrapper } from '@/modules/dashboard/components/CourseMapWrapper';

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = await params;
  let foundCourse = null;
  let trailId = '';

  for (const trail of DATABASE) {
    const course = trail.courses.find(c => c.id === resolvedParams.courseId);
    if (course) {
      foundCourse = course;
      trailId = trail.id;
      break;
    }
  }

  if (!foundCourse) notFound();

  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)] font-body">
      <div className="max-w-4xl mx-auto">
        <Link href={`/dashboard/trail/${trailId}`} className="inline-flex items-center text-brand-gray hover:text-[#2D8A5C] font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar para Cursos
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold font-headline text-foreground">{foundCourse.title}</h1>
          <p className="text-muted-foreground text-xl mt-2">{foundCourse.description}</p>
        </header>

        <CourseMapWrapper course={foundCourse} />
      </div>
    </div>
  );
}
