import React from 'react';

function ResearcherCard({ researcher }) {
  return (
    <div className="researcher-card">
      <img src={researcher.imageUrl} alt={researcher.name} />
      <h2>{researcher.name}</h2>
      <p>Field of Study: {researcher.field_of_study}</p>
      <p>Institution: {researcher.school_organization}</p>
      <p>Total Citations: {researcher.citation_count}</p>
      <p>Present at Conference: {researcher.present ? 'Yes' : 'No'}</p>
      <h3>Recent Papers:</h3>
      <ul>
        {researcher.research_papers.map(paper => (
          <li key={paper.paper_id}>
            <h4>{paper.title}</h4>
            <p>Published: {paper.publication_data}</p>
            <p>Citations: {paper.citation_count}</p>
            <p>Abstract: {paper.abstract.substring(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResearcherCard;
