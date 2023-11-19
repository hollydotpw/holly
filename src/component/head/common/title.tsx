type TitleProps = {
  readonly title: string;
};

export default function TitleHead({ title }: TitleProps) {
  return <title>{title}</title>;
}
