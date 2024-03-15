export const SubmitError = ({ error }: { error: string }) => {
  return <div className="my-2 text-red-600">{error}</div>;
};
