import { SubmitForm } from "../components/submit-form";

export default async function SubmitPage() {
  return (
    <>
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 text-center">
          Submit a website!
        </h1>
        <p className="font-medium text-gray-700 text-center max-w-md mx-auto my-6">
          Find something interesting to share with the community? Add it here!
        </p>
      </div>
      <SubmitForm />
    </>
  );
}
