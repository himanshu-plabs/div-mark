// // components/BookmarkCard.tsx
// import React from 'react';
// import Image from 'next/image';

// interface BookmarkCardProps {
//   screenshot: string;
//   heightMultiplier: number;
//   title: string;
//   description: string;
// }

// const BookmarkCard: React.FC<BookmarkCardProps> = ({ screenshot, heightMultiplier, title, description }) => {
//   const width = 300; // Set a fixed width
//   const baseHeight = 200; // Set a base height
//   const height = baseHeight * heightMultiplier;

//   return (
//     <div className="border rounded shadow-md overflow-hidden" style={{ width, height }}>
//       <div style={{ position: 'relative', width: '100%', height: `${height - 60}px` }}>
//         <Image
//           src={`data:image/png;base64,${screenshot}`}
//           alt={title}
//           layout="fill"
//           objectFit="cover"
//         />
//       </div>
//       <div className="p-2">
//         <h3 className="text-lg font-semibold truncate">{title}</h3>
//         <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
//       </div>
//     </div>
//   );
// };

// export default BookmarkCard;
// components/BookmarkCard.tsx


// components/BookmarkCard.tsx
// components/BookmarkCard.tsx
// import React from 'react';
// import Image from 'next/image';

// interface BookmarkCardProps {
//   screenshot: string | null;
//   title: string | null;
//   description: string;
//   random: number;
// }

// const getRandomHeightMultiplier = () => {
//   const multipliers = [1, 1, 1.5, 1, 1.5,1];
//   return multipliers[Math.floor(Math.random() * multipliers.length)];
// };

// const BookmarkCard: React.FC<BookmarkCardProps> = ({ screenshot, title, description,random }) => {
//   const width = 232; // Set a fixed width
//   const baseHeight = 200;
//   const height = random * baseHeight; //
  
//   return (
//     <div className=" shadow-md overflow-hidden " style={{ width, height }}>
//       {screenshot ? (
//         <>
//           <div style={{ position: 'relative', width: '100%', height: height ? height - 40 : '160px' }} className='rounded-md'>
//             <Image
//               src={`data:image/png;base64,${screenshot}`}
//               alt={title || "Bookmark"}
//               layout="fill"
//               objectFit="cover"
//               className='rounded-md'
//             />
//           </div>
//           <div className="p-2">
//             <h3 className="text-sm text-center font-nunito truncate bg-transparent  ">{title || "Untitled"}</h3>
//           </div>
//         </>
//       ) : (
//         <div className="p-4 bg-[#1e1f2a] h-full flex flex-col justify-between rounded-md">
//           <p className="text-[#748297] mb-4 text-sm font-nunito ">{description}</p>
//           {/* <h3 className="text-lg font-semibold truncate">{title || "Untitled"}</h3> */}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookmarkCard;
// components/BookmarkCard.tsx
import React from 'react';
import Image from 'next/image';

interface BookmarkCardProps {
  screenshot: string | null;
  title: string | null;
  description: string;
}

const getRandomHeightMultiplier = () => {
  const multipliers = [1, 0.8, 1, 1,1.25,0.8, 1.5];
  return multipliers[Math.floor(Math.random() * multipliers.length)];
};

const BookmarkCard: React.FC<BookmarkCardProps> = ({ screenshot, title, description }) => {
  const width = 232; // Set a fixed width
  const baseHeight = 200;
  const heightMultiplier = getRandomHeightMultiplier();
  const height = screenshot ? Math.floor(baseHeight * heightMultiplier) : undefined;

  return (
    <div className="  shadow-md overflow-hidden " style={{ width, height }}>
      {screenshot ? (
        <>
          <div style={{ position: 'relative', width: '100%', height: height ? height - 40 : '160px' }}>
            <Image
              src={`data:image/png;base64,${screenshot}`}
              alt={title || "Bookmark"}
              layout="fill"
              objectFit="cover"
              className='rounded-md'
            />
          </div>
          <div className="p-2">
            <h3 className="text-sm font-nunito truncate text-center">{title || "Untitled"}</h3>
          </div>
        </>
      ) : (
        <div className="p-4 bg-[#1e1f2a] h-full flex flex-col justify-between rounded-md">
          <p className="text-[#748297] mb-4 text-sm font-nunito ">{description}</p>
          {/* <h3 className="text-lg font-semibold truncate">{title || "Untitled"}</h3> */}
        </div>
      )}
    </div>
  );
};

export default BookmarkCard;