import './ContentSection.css'

function ContentSection({ title, description, additionalText }) {
  return (
    <section className="content-section">
      <h2 className="section-title">{title}</h2>
      <p className="section-description">{description}</p>
      <p className="section-additional">{additionalText}</p>
    </section>
  )
}

export default ContentSection
