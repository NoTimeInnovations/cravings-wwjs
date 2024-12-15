export default function log(msg) {
  if (process.env.ENV === "dev") {
    console.log(msg);
  }
}
