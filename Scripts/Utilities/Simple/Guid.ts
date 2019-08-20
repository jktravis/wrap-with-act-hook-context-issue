/**
 * Consider replacing/refactoring to use the Node.js UUID module instead
 * @see {@link https://www.npmjs.com/package/uuid}
 */
//export default
class Guid {
  public static emptyGuidString: string = "00000000-0000-0000-0000-000000000000";
  public static empty() {
    return Guid.emptyGuid;
  }
  public static newGuid() {
    return new Guid(
      Guid.s4() +
        Guid.s4() +
        "-" +
        Guid.s4() +
        "-" +
        Guid.s4() +
        "-" +
        Guid.s4() +
        "-" +
        Guid.s4() +
        Guid.s4() +
        Guid.s4(),
    );
  }
  private static emptyGuid = new Guid(Guid.emptyGuidString);
  private static regex(format?: string) {
    switch (format) {
      case "x":
      case "X":
        return /\{[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}\}/i;

      default:
        return /[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}/i;
    }
  }
  private static s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  private id: string;
  constructor(id: string) {
    this.id = id.toLowerCase();
  }
  public toString(format: string) {
    switch (format) {
      case "x":
      case "X":
        return "{" + this.id + "}";

      default:
        return this.id;
    }
  }
  public valueOf() {
    return this.id;
  }
}
