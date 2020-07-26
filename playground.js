// "Content-Type": "application/pdf",
// "Content-Disposition": "attachment; filename=some_file.pdf",
// "Content-Length": data.length,

// let Array = [
// {
//     filename: "Ct3paperJune2020",
//     file: "sadfgfds",
//     courseid: "15EC405",
// },
// {
//     filename: "Ct3paperMay2020",
//     file: "sadfgfdghjkls",
//     courseid: "15EC405",
// },
// {
//     filename: "Ct3paperJuly2020",
//     file: "sadfgfdsfghjk",
//     courseid: "15EC405",
// },
// {
//     filename: "Ct3paperApril2020",
//     file: "sadfgfdsghjkl",
//     courseid: "15EC405",
// }];

// function Deletefile(value){
//     delete  value.file;
// }
// Array.forEach(Deletefile);
// console.log(Array);

// let user = [];
// if (!user.length)
//     console.log(true);
// else
//     console.log(false);

// let room = "PrivateRoom89456123301255";
// if (room.substring(0, 11) == "PrivateRoom")
//     console.log("Dance");
// else
//     console.log("SuperDance");

// var Rooms = [
//     "Electronics", "robotics", "CampusLife", "I.E", "general"
// ];
// var User = [
// //   {
// //     username: "sausad",
// //     room: "Electronics",
// //   },
// //   {
// //     username: "sadfg",
// //     room: "general",
// //   },
// //   {
// //     username: "fsdfgf",
// //     room: "general",
// //     },
// //     {
// //         username: "uytghsa",
// //         room:"Electronics"
// //   }
// ];

// var userInEachRoom=[];
// Rooms.forEach((room) => {
//   let length = User.filter((value) => {
//     return value.room == room;
//   }).length;
//   userInEachRoom.push(length);
// });
// console.log(userInEachRoom);

// var Collection = new Map();
// var room = 'Sayam';
// var block = {
//   sent: 'Rahul',
//   timestamp: 15365984,
//   message: 'Hi everybody'
// }
// var Messages = [];
// Messages.push(block);
// Collection.set(room, Messages);
// var block2 = {
//   sent: "Rahul",
//   timestamp: 15365984,
//   message: "Bye",
// };
// var addMessage = (room) => {
//   return room;
// };
// Messages.push(block2);
// Collection[room]= Messages;
// var M = Collection.get(addMessage('Sayam'));
// // console.log(Collection);
// var AllUser=new Map();
// var user = {
//     username: "Sayam",
//     room: "AdminsofStudlife",
//     id:"qSDSFGHAWE95"
// }
// AllUser.set(user.id, user);
// console.log(`User is equal to\n${ AllUser.get(user.id) }`);

// var Rooms = [];
// Rooms.push({ roomName: "Admin", official: true });
// Rooms.push({ roomName: "Panel", official: true });
// Rooms.push({ roomName: "Bots", official: false });
// if (!Rooms.includes({ roomName: "Bots" })) {
// Rooms.push("total");
// }
// console.log(Rooms);
console.log(new Date().getTime());