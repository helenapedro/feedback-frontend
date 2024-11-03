export const calculateDaysPassed = (createdAt: Date) => {
     const now = new Date();
     const createdDate = new Date(createdAt);
     const timeDiff = Math.abs(now.getTime() - createdDate.getTime());
     const daysPassed = Math.ceil(timeDiff / (1000 * 3600 * 24));
     return daysPassed;
};
   