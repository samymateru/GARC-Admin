type ErrorProps = {
  error?: { message?: string };
};
export function FormError({ error }: ErrorProps) {
  return (
    <p
      className={`text-red-500 font-semibold text-[13px] pt-[2px] ${
        error ? "opacity-100" : "opacity-0"
      }`}>
      {String(error?.message)}
    </p>
  );
}
