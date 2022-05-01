

export abstract class Config {
  public static getMapProviderUrl( q : string ) : string {
    return "https://maps.google.com/?q=" + encodeURI( q );
  }
}

export default Config;


