// app/loading.tsx
'use client';

import Loader from "./components/loader";



export default function Loading() {
  // This will be shown automatically whenever any child route
  // or child-layout is fetching/loading.
  return <Loader />;
}
