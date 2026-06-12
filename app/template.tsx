export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade flex flex-col flex-1">{children}</div>;
}
