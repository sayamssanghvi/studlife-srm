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

var Rooms = [
    "Electronics", "robotics", "CampusLife", "I.E", "general"
];
var User = [
//   {
//     username: "sausad",
//     room: "Electronics",
//   },
//   {
//     username: "sadfg",
//     room: "general",
//   },
//   {
//     username: "fsdfgf",
//     room: "general",
//     },
//     {
//         username: "uytghsa",
//         room:"Electronics"
//   }
];

var userInEachRoom=[];
Rooms.forEach((room) => {
  let length = User.filter((value) => {
    return value.room == room;
  }).length;
  userInEachRoom.push(length);
});
console.log(userInEachRoom);