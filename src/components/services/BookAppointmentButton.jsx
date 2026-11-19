
// "use client";

// import { useRouter } from "next/navigation";
// import { authClient } from "@/lib/auth-client";
// import { CalendarDays, Loader2 } from "lucide-react";

// export default function BookAppointmentButton({ serviceId }) {
//   const router = useRouter();

//   const { data: session, isPending } = authClient.useSession();

//   if (isPending) {
//     return (
//       <button
//         disabled
//         className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-gray-200 text-gray-500"
//       >
//         <Loader2 className="mr-2 animate-spin" size={18} />
//         Checking...
//       </button>
//     );
//   }

//   // Admin cannot book appointments
//   if (session?.user?.role === "admin") {
//     return (
//       <button
//         disabled
//         className="mt-8 h-12 w-full cursor-not-allowed rounded-xl bg-gray-200 font-semibold text-gray-500"
//       >
//         Admins Cannot Book Appointments
//       </button>
//     );
//   }

//   // Guest must sign in first
//   if (!session?.user) {
//     const callbackURL = `/services/${serviceId}#booking`;

//     return (
//       <button
//         onClick={() =>
//           router.push(
//             `/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`
//           )
//         }
//         className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-600 font-semibold text-white transition hover:bg-rose-700"
//       >
//         <CalendarDays size={18} />
//         Sign In to Book
//       </button>
//     );
//   }

//   // Customer can continue to booking section
//   return (
//     <a
//       href={`/services/${serviceId}#booking`}
//       className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-rose-600 font-semibold text-white transition hover:bg-rose-700"
//     >
//       <CalendarDays size={18} />
//       Book Appointment
//     </a>
//   );
// }
