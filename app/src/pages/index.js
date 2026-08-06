import { getProjects, getSite } from "@/lib/sanity";
import styles from "@/styles/pages/Index.module.css";

export default function Index({ projects }) {
  return (
    <div className={`page ${styles.page}`}>
      <main className="main">
        {projects.map((project, index) => {
          <Media medium={project.thumbnail.medium} />;
        })}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const [site, projects] = await Promise.all([getSite(), getProjects()]);

  return {
    props: {
      site,
      projects,
    },
    revalidate: 60,
  };
}
