type Props = {
  title: string;
  subtitle?: string;
};

export function FestiveHead({ title, subtitle }: Props) {
  return (
    <div className="section__head section__head--festive">
      <h2>{title}</h2>
      <div className="section__head-line" aria-hidden />
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
