import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

declare var google: any;

function loadGoogleMapsApi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (
      typeof window !== "undefined" &&
      (window as any).google &&
      (window as any).google.maps
    ) {
      resolve();
      return;
    }
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", (err) => reject(err));
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMaps.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });
}

@Injectable({
  providedIn: "root",
})
export class GoogleMapsService {
  private geocoder: any;
  private placesService: any;

  constructor(private http: HttpClient) {}

  private async initGoogleObjects() {
    await loadGoogleMapsApi();
    this.geocoder = new google.maps.Geocoder();
    this.placesService = new google.maps.places.PlacesService(
      document.createElement("div")
    );
  }

  public async getZipCodesInRadius(
    zipCode: string,
    radius: number
  ): Promise<string[]> {
    await this.initGoogleObjects();
    return new Promise<string[]>((resolve, reject) => {
      this.geocoder.geocode(
        { address: zipCode },
        (results: any[], status: any) => {
          if (status !== "OK") {
            reject(new Error(`Geocode failed: ${status}`));
          } else {
            const location = results[0].geometry.location;
            const request = {
              location: location,
              radius: radius,
              type: "postal_code",
            };
            this.placesService.nearbySearch(
              request,
              (results: any[], status: any) => {
                if (status !== "OK") {
                  reject(new Error(`Nearby search failed: ${status}`));
                } else {
                  const zipCodes = results.map((result) => result.postal_code);
                  resolve(zipCodes);
                }
              }
            );
          }
        }
      );
    });
  }

  public findNearbyZipcodes(
    lat: number,
    lng: number,
    radius: number
  ): Promise<string[]> {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=postal_code&key=${environment.googleMaps.apiKey}`;
    return this.http
      .get(url)
      .toPromise()
      .then((response: any) => {
        const results = response.results || [];
        const zipcodes = results.map((result: any) => result.name);
        return zipcodes;
      });
  }
}
