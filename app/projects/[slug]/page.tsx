import { PROJECTS } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = PROJECTS.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container max-w-4xl">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-colors mb-12 group"
          data-cursor-variant="hover"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Projects
        </Link>

        <p className="overline mb-6" style={{ color: project.color }}>
          {project.category}
        </p>

        <h1 className="font-clash font-bold text-5xl md:text-7xl text-white mb-8 leading-tight">
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-3 mb-12">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="tag"
              style={{ borderColor: project.color + '40', color: project.color }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="font-montreal text-[#A0A0A0] text-lg leading-relaxed mb-12">
            {project.description}
          </p>

          <div
            className={`w-full aspect-video rounded-3xl bg-gradient-to-br ${project.gradient} border ${project.border} mb-12 flex items-center justify-center`}
          >
             <span className="text-white/20 font-mono text-sm">Preview coming soon</span>
          </div>
          
          <h2 className="font-clash font-bold text-3xl text-white mb-6">Overview</h2>
          <p className="font-montreal text-[#A0A0A0] mb-8">
             Detailed case study content will be updated here. This represents a placeholder for the deep dive into problem, solution, architecture, and challenges faced during the development of this project.
          </p>

          <a
             href="https://github.com/vedantyerne1-art"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium font-montreal text-white neon-border-blue hover:shadow-neon-blue transition-all duration-300"
             data-cursor-variant="hover"
          >
             View on GitHub
             <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
               <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
             </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
