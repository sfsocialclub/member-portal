import Image from "next/image";
import ShareAppleIcon from "./share-apple-svgrepo-com.svg";
import HorizEllipsisIcon from "./ellipsis-svgrepo-com.svg";

export default function AddAppToHomeScreenPage() {
  return (
    <div className="flex flex-col justify-start w-full">
      <h1 className="text-3xl font-bold mt-4">Add app to Home screen</h1>
      <section className="mt-10">
        <h2 className="text-xl font-bold">Android</h2>
        <ol className="list-disc pl-5">
          <li>Open the app in Chrome</li>
          <li>Tap the three dots in the top right corner</li>
          <li>Tap "Install app"</li>
          <li>Tap "Add to Home screen"</li>
        </ol>
      </section>
      <section className="mt-10">
        <h2 className="text-xl font-bold">iOS 26+</h2>
        <ol className="list-disc pl-5">
          <li>Open the app in Safari</li>
          <li>Tap the <Image src={HorizEllipsisIcon} alt="More" width={24} height={24} className="inline"/> button</li>
          <li>Tap the <Image src={ShareAppleIcon} alt="Share" width={24} height={24} className="inline"/> Share button</li>
          <li>Tap the <Image src={HorizEllipsisIcon} alt="More" width={24} height={24} className="inline"/> More button</li>
          <li>Tap "Add to Home Screen"</li>
        </ol>
      </section>
    </div>
  );
}
