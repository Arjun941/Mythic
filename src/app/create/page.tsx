import { CardCreator } from '@/components/card-creator';

export default function CreatePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 selection:bg-accent selection:text-accent-foreground">
      <div className="w-full max-w-7xl mx-auto">
        <CardCreator />
      </div>
    </main>
  );
}
