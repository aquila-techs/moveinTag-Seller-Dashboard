import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { Form, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '@core/services/services/user.service';
import { CoreConfigService } from '@core/services/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { base64ToFile, ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ClipboardService } from 'ngx-clipboard';
import { MapCircle } from '@angular/google-maps';
import { GoogleMapsService } from '@core/services/services/googlemap.service';
import { AuthenticationService } from '@core/services/authentication.service';

import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { map, catchError, tap, take, takeWhile, takeUntil } from 'rxjs/operators';
import { Observable, throwError, interval, Subject } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public userSavedZipCodes = "";
  public searchTypeFind = "";
  public customPostalCodeFromPofile = "";
  public baseURL: any = environment.serverURL;
  public contentHeader: object;
  public progressbarHeight = '.857rem';
  public sellerProfile: any;
  public profileUpdateForm: UntypedFormGroup;
  public submitted = false;
  public userId = '';
  public categories: any;
  public searchSubCategories: any;
  public sellerCategories: any;
  public sellerServicePhotos: any;
  myFiles: string[] = [];
  public sellerWebLinksForm: UntypedFormGroup;
  public markerCirclePolygonCenter;
  public markerCirclePolygonZoom = 13;
  @ViewChild("mapCircle") circle: MapCircle;
  public sliderWithNgModel: number = 5;
  @ViewChild('map') mapElement: any;
  map: any;
  public mapCircleCenter: google.maps.LatLngLiteral;
  public mapCircleOptions;
  public countriesData: any;
  public countriesDataCustom: any;

  public countriesList = [];
  countries: string[] = [];
  public countryStates = [];
  public countryCitiesZipCode = [];
  public countryCitiesCustom = [];
  countryCities: string[] = [];
  searchText: string = "";
  selectedOption = 1;
  phoneCode = "";
  phone = "";
  code = "";
  countryCode = [
    {
      "name": "Afghanistan",
      "dial_code": "+93",
      "code": "AF"
    },
    {
      "name": "Aland Islands",
      "dial_code": "+358",
      "code": "AX"
    },
    {
      "name": "Albania",
      "dial_code": "+355",
      "code": "AL"
    },
    {
      "name": "Algeria",
      "dial_code": "+213",
      "code": "DZ"
    },
    {
      "name": "AmericanSamoa",
      "dial_code": "+1684",
      "code": "AS"
    },
    {
      "name": "Andorra",
      "dial_code": "+376",
      "code": "AD"
    },
    {
      "name": "Angola",
      "dial_code": "+244",
      "code": "AO"
    },
    {
      "name": "Anguilla",
      "dial_code": "+1264",
      "code": "AI"
    },
    {
      "name": "Antarctica",
      "dial_code": "+672",
      "code": "AQ"
    },
    {
      "name": "Antigua and Barbuda",
      "dial_code": "+1268",
      "code": "AG"
    },
    {
      "name": "Argentina",
      "dial_code": "+54",
      "code": "AR"
    },
    {
      "name": "Armenia",
      "dial_code": "+374",
      "code": "AM"
    },
    {
      "name": "Aruba",
      "dial_code": "+297",
      "code": "AW"
    },
    {
      "name": "Australia",
      "dial_code": "+61",
      "code": "AU"
    },
    {
      "name": "Austria",
      "dial_code": "+43",
      "code": "AT"
    },
    {
      "name": "Azerbaijan",
      "dial_code": "+994",
      "code": "AZ"
    },
    {
      "name": "Bahamas",
      "dial_code": "+1242",
      "code": "BS"
    },
    {
      "name": "Bahrain",
      "dial_code": "+973",
      "code": "BH"
    },
    {
      "name": "Bangladesh",
      "dial_code": "+880",
      "code": "BD"
    },
    {
      "name": "Barbados",
      "dial_code": "+1246",
      "code": "BB"
    },
    {
      "name": "Belarus",
      "dial_code": "+375",
      "code": "BY"
    },
    {
      "name": "Belgium",
      "dial_code": "+32",
      "code": "BE"
    },
    {
      "name": "Belize",
      "dial_code": "+501",
      "code": "BZ"
    },
    {
      "name": "Benin",
      "dial_code": "+229",
      "code": "BJ"
    },
    {
      "name": "Bermuda",
      "dial_code": "+1441",
      "code": "BM"
    },
    {
      "name": "Bhutan",
      "dial_code": "+975",
      "code": "BT"
    },
    {
      "name": "Bolivia, Plurinational State of",
      "dial_code": "+591",
      "code": "BO"
    },
    {
      "name": "Bosnia and Herzegovina",
      "dial_code": "+387",
      "code": "BA"
    },
    {
      "name": "Botswana",
      "dial_code": "+267",
      "code": "BW"
    },
    {
      "name": "Brazil",
      "dial_code": "+55",
      "code": "BR"
    },
    {
      "name": "British Indian Ocean Territory",
      "dial_code": "+246",
      "code": "IO"
    },
    {
      "name": "Brunei Darussalam",
      "dial_code": "+673",
      "code": "BN"
    },
    {
      "name": "Bulgaria",
      "dial_code": "+359",
      "code": "BG"
    },
    {
      "name": "Burkina Faso",
      "dial_code": "+226",
      "code": "BF"
    },
    {
      "name": "Burundi",
      "dial_code": "+257",
      "code": "BI"
    },
    {
      "name": "Cambodia",
      "dial_code": "+855",
      "code": "KH"
    },
    {
      "name": "Cameroon",
      "dial_code": "+237",
      "code": "CM"
    },
    {
      "name": "Canada",
      "dial_code": "+1",
      "code": "CA"
    },
    {
      "name": "Cape Verde",
      "dial_code": "+238",
      "code": "CV"
    },
    {
      "name": "Cayman Islands",
      "dial_code": "+ 345",
      "code": "KY"
    },
    {
      "name": "Central African Republic",
      "dial_code": "+236",
      "code": "CF"
    },
    {
      "name": "Chad",
      "dial_code": "+235",
      "code": "TD"
    },
    {
      "name": "Chile",
      "dial_code": "+56",
      "code": "CL"
    },
    {
      "name": "China",
      "dial_code": "+86",
      "code": "CN"
    },
    {
      "name": "Christmas Island",
      "dial_code": "+61",
      "code": "CX"
    },
    {
      "name": "Cocos (Keeling) Islands",
      "dial_code": "+61",
      "code": "CC"
    },
    {
      "name": "Colombia",
      "dial_code": "+57",
      "code": "CO"
    },
    {
      "name": "Comoros",
      "dial_code": "+269",
      "code": "KM"
    },
    {
      "name": "Congo",
      "dial_code": "+242",
      "code": "CG"
    },
    {
      "name": "Congo, The Democratic Republic of the Congo",
      "dial_code": "+243",
      "code": "CD"
    },
    {
      "name": "Cook Islands",
      "dial_code": "+682",
      "code": "CK"
    },
    {
      "name": "Costa Rica",
      "dial_code": "+506",
      "code": "CR"
    },
    {
      "name": "Cote d'Ivoire",
      "dial_code": "+225",
      "code": "CI"
    },
    {
      "name": "Croatia",
      "dial_code": "+385",
      "code": "HR"
    },
    {
      "name": "Cuba",
      "dial_code": "+53",
      "code": "CU"
    },
    {
      "name": "Cyprus",
      "dial_code": "+357",
      "code": "CY"
    },
    {
      "name": "Czech Republic",
      "dial_code": "+420",
      "code": "CZ"
    },
    {
      "name": "Denmark",
      "dial_code": "+45",
      "code": "DK"
    },
    {
      "name": "Djibouti",
      "dial_code": "+253",
      "code": "DJ"
    },
    {
      "name": "Dominica",
      "dial_code": "+1767",
      "code": "DM"
    },
    {
      "name": "Dominican Republic",
      "dial_code": "+1849",
      "code": "DO"
    },
    {
      "name": "Ecuador",
      "dial_code": "+593",
      "code": "EC"
    },
    {
      "name": "Egypt",
      "dial_code": "+20",
      "code": "EG"
    },
    {
      "name": "El Salvador",
      "dial_code": "+503",
      "code": "SV"
    },
    {
      "name": "Equatorial Guinea",
      "dial_code": "+240",
      "code": "GQ"
    },
    {
      "name": "Eritrea",
      "dial_code": "+291",
      "code": "ER"
    },
    {
      "name": "Estonia",
      "dial_code": "+372",
      "code": "EE"
    },
    {
      "name": "Ethiopia",
      "dial_code": "+251",
      "code": "ET"
    },
    {
      "name": "Falkland Islands (Malvinas)",
      "dial_code": "+500",
      "code": "FK"
    },
    {
      "name": "Faroe Islands",
      "dial_code": "+298",
      "code": "FO"
    },
    {
      "name": "Fiji",
      "dial_code": "+679",
      "code": "FJ"
    },
    {
      "name": "Finland",
      "dial_code": "+358",
      "code": "FI"
    },
    {
      "name": "France",
      "dial_code": "+33",
      "code": "FR"
    },
    {
      "name": "French Guiana",
      "dial_code": "+594",
      "code": "GF"
    },
    {
      "name": "French Polynesia",
      "dial_code": "+689",
      "code": "PF"
    },
    {
      "name": "Gabon",
      "dial_code": "+241",
      "code": "GA"
    },
    {
      "name": "Gambia",
      "dial_code": "+220",
      "code": "GM"
    },
    {
      "name": "Georgia",
      "dial_code": "+995",
      "code": "GE"
    },
    {
      "name": "Germany",
      "dial_code": "+49",
      "code": "DE"
    },
    {
      "name": "Ghana",
      "dial_code": "+233",
      "code": "GH"
    },
    {
      "name": "Gibraltar",
      "dial_code": "+350",
      "code": "GI"
    },
    {
      "name": "Greece",
      "dial_code": "+30",
      "code": "GR"
    },
    {
      "name": "Greenland",
      "dial_code": "+299",
      "code": "GL"
    },
    {
      "name": "Grenada",
      "dial_code": "+1473",
      "code": "GD"
    },
    {
      "name": "Guadeloupe",
      "dial_code": "+590",
      "code": "GP"
    },
    {
      "name": "Guam",
      "dial_code": "+1671",
      "code": "GU"
    },
    {
      "name": "Guatemala",
      "dial_code": "+502",
      "code": "GT"
    },
    {
      "name": "Guernsey",
      "dial_code": "+44",
      "code": "GG"
    },
    {
      "name": "Guinea",
      "dial_code": "+224",
      "code": "GN"
    },
    {
      "name": "Guinea-Bissau",
      "dial_code": "+245",
      "code": "GW"
    },
    {
      "name": "Guyana",
      "dial_code": "+595",
      "code": "GY"
    },
    {
      "name": "Haiti",
      "dial_code": "+509",
      "code": "HT"
    },
    {
      "name": "Holy See (Vatican City State)",
      "dial_code": "+379",
      "code": "VA"
    },
    {
      "name": "Honduras",
      "dial_code": "+504",
      "code": "HN"
    },
    {
      "name": "Hong Kong",
      "dial_code": "+852",
      "code": "HK"
    },
    {
      "name": "Hungary",
      "dial_code": "+36",
      "code": "HU"
    },
    {
      "name": "Iceland",
      "dial_code": "+354",
      "code": "IS"
    },
    {
      "name": "India",
      "dial_code": "+91",
      "code": "IN"
    },
    {
      "name": "Indonesia",
      "dial_code": "+62",
      "code": "ID"
    },
    {
      "name": "Iran, Islamic Republic of Persian Gulf",
      "dial_code": "+98",
      "code": "IR"
    },
    {
      "name": "Iraq",
      "dial_code": "+964",
      "code": "IQ"
    },
    {
      "name": "Ireland",
      "dial_code": "+353",
      "code": "IE"
    },
    {
      "name": "Isle of Man",
      "dial_code": "+44",
      "code": "IM"
    },
    {
      "name": "Israel",
      "dial_code": "+972",
      "code": "IL"
    },
    {
      "name": "Italy",
      "dial_code": "+39",
      "code": "IT"
    },
    {
      "name": "Jamaica",
      "dial_code": "+1876",
      "code": "JM"
    },
    {
      "name": "Japan",
      "dial_code": "+81",
      "code": "JP"
    },
    {
      "name": "Jersey",
      "dial_code": "+44",
      "code": "JE"
    },
    {
      "name": "Jordan",
      "dial_code": "+962",
      "code": "JO"
    },
    {
      "name": "Kazakhstan",
      "dial_code": "+77",
      "code": "KZ"
    },
    {
      "name": "Kenya",
      "dial_code": "+254",
      "code": "KE"
    },
    {
      "name": "Kiribati",
      "dial_code": "+686",
      "code": "KI"
    },
    {
      "name": "Korea, Democratic People's Republic of Korea",
      "dial_code": "+850",
      "code": "KP"
    },
    {
      "name": "Korea, Republic of South Korea",
      "dial_code": "+82",
      "code": "KR"
    },
    {
      "name": "Kuwait",
      "dial_code": "+965",
      "code": "KW"
    },
    {
      "name": "Kyrgyzstan",
      "dial_code": "+996",
      "code": "KG"
    },
    {
      "name": "Laos",
      "dial_code": "+856",
      "code": "LA"
    },
    {
      "name": "Latvia",
      "dial_code": "+371",
      "code": "LV"
    },
    {
      "name": "Lebanon",
      "dial_code": "+961",
      "code": "LB"
    },
    {
      "name": "Lesotho",
      "dial_code": "+266",
      "code": "LS"
    },
    {
      "name": "Liberia",
      "dial_code": "+231",
      "code": "LR"
    },
    {
      "name": "Libyan Arab Jamahiriya",
      "dial_code": "+218",
      "code": "LY"
    },
    {
      "name": "Liechtenstein",
      "dial_code": "+423",
      "code": "LI"
    },
    {
      "name": "Lithuania",
      "dial_code": "+370",
      "code": "LT"
    },
    {
      "name": "Luxembourg",
      "dial_code": "+352",
      "code": "LU"
    },
    {
      "name": "Macao",
      "dial_code": "+853",
      "code": "MO"
    },
    {
      "name": "Macedonia",
      "dial_code": "+389",
      "code": "MK"
    },
    {
      "name": "Madagascar",
      "dial_code": "+261",
      "code": "MG"
    },
    {
      "name": "Malawi",
      "dial_code": "+265",
      "code": "MW"
    },
    {
      "name": "Malaysia",
      "dial_code": "+60",
      "code": "MY"
    },
    {
      "name": "Maldives",
      "dial_code": "+960",
      "code": "MV"
    },
    {
      "name": "Mali",
      "dial_code": "+223",
      "code": "ML"
    },
    {
      "name": "Malta",
      "dial_code": "+356",
      "code": "MT"
    },
    {
      "name": "Marshall Islands",
      "dial_code": "+692",
      "code": "MH"
    },
    {
      "name": "Martinique",
      "dial_code": "+596",
      "code": "MQ"
    },
    {
      "name": "Mauritania",
      "dial_code": "+222",
      "code": "MR"
    },
    {
      "name": "Mauritius",
      "dial_code": "+230",
      "code": "MU"
    },
    {
      "name": "Mayotte",
      "dial_code": "+262",
      "code": "YT"
    },
    {
      "name": "Mexico",
      "dial_code": "+52",
      "code": "MX"
    },
    {
      "name": "Micronesia, Federated States of Micronesia",
      "dial_code": "+691",
      "code": "FM"
    },
    {
      "name": "Moldova",
      "dial_code": "+373",
      "code": "MD"
    },
    {
      "name": "Monaco",
      "dial_code": "+377",
      "code": "MC"
    },
    {
      "name": "Mongolia",
      "dial_code": "+976",
      "code": "MN"
    },
    {
      "name": "Montenegro",
      "dial_code": "+382",
      "code": "ME"
    },
    {
      "name": "Montserrat",
      "dial_code": "+1664",
      "code": "MS"
    },
    {
      "name": "Morocco",
      "dial_code": "+212",
      "code": "MA"
    },
    {
      "name": "Mozambique",
      "dial_code": "+258",
      "code": "MZ"
    },
    {
      "name": "Myanmar",
      "dial_code": "+95",
      "code": "MM"
    },
    {
      "name": "Namibia",
      "dial_code": "+264",
      "code": "NA"
    },
    {
      "name": "Nauru",
      "dial_code": "+674",
      "code": "NR"
    },
    {
      "name": "Nepal",
      "dial_code": "+977",
      "code": "NP"
    },
    {
      "name": "Netherlands",
      "dial_code": "+31",
      "code": "NL"
    },
    {
      "name": "Netherlands Antilles",
      "dial_code": "+599",
      "code": "AN"
    },
    {
      "name": "New Caledonia",
      "dial_code": "+687",
      "code": "NC"
    },
    {
      "name": "New Zealand",
      "dial_code": "+64",
      "code": "NZ"
    },
    {
      "name": "Nicaragua",
      "dial_code": "+505",
      "code": "NI"
    },
    {
      "name": "Niger",
      "dial_code": "+227",
      "code": "NE"
    },
    {
      "name": "Nigeria",
      "dial_code": "+234",
      "code": "NG"
    },
    {
      "name": "Niue",
      "dial_code": "+683",
      "code": "NU"
    },
    {
      "name": "Norfolk Island",
      "dial_code": "+672",
      "code": "NF"
    },
    {
      "name": "Northern Mariana Islands",
      "dial_code": "+1670",
      "code": "MP"
    },
    {
      "name": "Norway",
      "dial_code": "+47",
      "code": "NO"
    },
    {
      "name": "Oman",
      "dial_code": "+968",
      "code": "OM"
    },
    {
      "name": "Pakistan",
      "dial_code": "+92",
      "code": "PK"
    },
    {
      "name": "Palau",
      "dial_code": "+680",
      "code": "PW"
    },
    {
      "name": "Palestinian Territory, Occupied",
      "dial_code": "+970",
      "code": "PS"
    },
    {
      "name": "Panama",
      "dial_code": "+507",
      "code": "PA"
    },
    {
      "name": "Papua New Guinea",
      "dial_code": "+675",
      "code": "PG"
    },
    {
      "name": "Paraguay",
      "dial_code": "+595",
      "code": "PY"
    },
    {
      "name": "Peru",
      "dial_code": "+51",
      "code": "PE"
    },
    {
      "name": "Philippines",
      "dial_code": "+63",
      "code": "PH"
    },
    {
      "name": "Pitcairn",
      "dial_code": "+872",
      "code": "PN"
    },
    {
      "name": "Poland",
      "dial_code": "+48",
      "code": "PL"
    },
    {
      "name": "Portugal",
      "dial_code": "+351",
      "code": "PT"
    },
    {
      "name": "Puerto Rico",
      "dial_code": "+1939",
      "code": "PR"
    },
    {
      "name": "Qatar",
      "dial_code": "+974",
      "code": "QA"
    },
    {
      "name": "Romania",
      "dial_code": "+40",
      "code": "RO"
    },
    {
      "name": "Russia",
      "dial_code": "+7",
      "code": "RU"
    },
    {
      "name": "Rwanda",
      "dial_code": "+250",
      "code": "RW"
    },
    {
      "name": "Reunion",
      "dial_code": "+262",
      "code": "RE"
    },
    {
      "name": "Saint Barthelemy",
      "dial_code": "+590",
      "code": "BL"
    },
    {
      "name": "Saint Helena, Ascension and Tristan Da Cunha",
      "dial_code": "+290",
      "code": "SH"
    },
    {
      "name": "Saint Kitts and Nevis",
      "dial_code": "+1869",
      "code": "KN"
    },
    {
      "name": "Saint Lucia",
      "dial_code": "+1758",
      "code": "LC"
    },
    {
      "name": "Saint Martin",
      "dial_code": "+590",
      "code": "MF"
    },
    {
      "name": "Saint Pierre and Miquelon",
      "dial_code": "+508",
      "code": "PM"
    },
    {
      "name": "Saint Vincent and the Grenadines",
      "dial_code": "+1784",
      "code": "VC"
    },
    {
      "name": "Samoa",
      "dial_code": "+685",
      "code": "WS"
    },
    {
      "name": "San Marino",
      "dial_code": "+378",
      "code": "SM"
    },
    {
      "name": "Sao Tome and Principe",
      "dial_code": "+239",
      "code": "ST"
    },
    {
      "name": "Saudi Arabia",
      "dial_code": "+966",
      "code": "SA"
    },
    {
      "name": "Senegal",
      "dial_code": "+221",
      "code": "SN"
    },
    {
      "name": "Serbia",
      "dial_code": "+381",
      "code": "RS"
    },
    {
      "name": "Seychelles",
      "dial_code": "+248",
      "code": "SC"
    },
    {
      "name": "Sierra Leone",
      "dial_code": "+232",
      "code": "SL"
    },
    {
      "name": "Singapore",
      "dial_code": "+65",
      "code": "SG"
    },
    {
      "name": "Slovakia",
      "dial_code": "+421",
      "code": "SK"
    },
    {
      "name": "Slovenia",
      "dial_code": "+386",
      "code": "SI"
    },
    {
      "name": "Solomon Islands",
      "dial_code": "+677",
      "code": "SB"
    },
    {
      "name": "Somalia",
      "dial_code": "+252",
      "code": "SO"
    },
    {
      "name": "South Africa",
      "dial_code": "+27",
      "code": "ZA"
    },
    {
      "name": "South Sudan",
      "dial_code": "+211",
      "code": "SS"
    },
    {
      "name": "South Georgia and the South Sandwich Islands",
      "dial_code": "+500",
      "code": "GS"
    },
    {
      "name": "Spain",
      "dial_code": "+34",
      "code": "ES"
    },
    {
      "name": "Sri Lanka",
      "dial_code": "+94",
      "code": "LK"
    },
    {
      "name": "Sudan",
      "dial_code": "+249",
      "code": "SD"
    },
    {
      "name": "Suriname",
      "dial_code": "+597",
      "code": "SR"
    },
    {
      "name": "Svalbard and Jan Mayen",
      "dial_code": "+47",
      "code": "SJ"
    },
    {
      "name": "Swaziland",
      "dial_code": "+268",
      "code": "SZ"
    },
    {
      "name": "Sweden",
      "dial_code": "+46",
      "code": "SE"
    },
    {
      "name": "Switzerland",
      "dial_code": "+41",
      "code": "CH"
    },
    {
      "name": "Syrian Arab Republic",
      "dial_code": "+963",
      "code": "SY"
    },
    {
      "name": "Taiwan",
      "dial_code": "+886",
      "code": "TW"
    },
    {
      "name": "Tajikistan",
      "dial_code": "+992",
      "code": "TJ"
    },
    {
      "name": "Tanzania, United Republic of Tanzania",
      "dial_code": "+255",
      "code": "TZ"
    },
    {
      "name": "Thailand",
      "dial_code": "+66",
      "code": "TH"
    },
    {
      "name": "Timor-Leste",
      "dial_code": "+670",
      "code": "TL"
    },
    {
      "name": "Togo",
      "dial_code": "+228",
      "code": "TG"
    },
    {
      "name": "Tokelau",
      "dial_code": "+690",
      "code": "TK"
    },
    {
      "name": "Tonga",
      "dial_code": "+676",
      "code": "TO"
    },
    {
      "name": "Trinidad and Tobago",
      "dial_code": "+1868",
      "code": "TT"
    },
    {
      "name": "Tunisia",
      "dial_code": "+216",
      "code": "TN"
    },
    {
      "name": "Turkey",
      "dial_code": "+90",
      "code": "TR"
    },
    {
      "name": "Turkmenistan",
      "dial_code": "+993",
      "code": "TM"
    },
    {
      "name": "Turks and Caicos Islands",
      "dial_code": "+1649",
      "code": "TC"
    },
    {
      "name": "Tuvalu",
      "dial_code": "+688",
      "code": "TV"
    },
    {
      "name": "Uganda",
      "dial_code": "+256",
      "code": "UG"
    },
    {
      "name": "Ukraine",
      "dial_code": "+380",
      "code": "UA"
    },
    {
      "name": "United Arab Emirates",
      "dial_code": "+971",
      "code": "AE"
    },
    {
      "name": "United Kingdom",
      "dial_code": "+44",
      "code": "GB"
    },
    {
      "name": "United States",
      "dial_code": "+1",
      "code": "US"
    },
    {
      "name": "Uruguay",
      "dial_code": "+598",
      "code": "UY"
    },
    {
      "name": "Uzbekistan",
      "dial_code": "+998",
      "code": "UZ"
    },
    {
      "name": "Vanuatu",
      "dial_code": "+678",
      "code": "VU"
    },
    {
      "name": "Venezuela, Bolivarian Republic of Venezuela",
      "dial_code": "+58",
      "code": "VE"
    },
    {
      "name": "Vietnam",
      "dial_code": "+84",
      "code": "VN"
    },
    {
      "name": "Virgin Islands, British",
      "dial_code": "+1284",
      "code": "VG"
    },
    {
      "name": "Virgin Islands, U.S.",
      "dial_code": "+1340",
      "code": "VI"
    },
    {
      "name": "Wallis and Futuna",
      "dial_code": "+681",
      "code": "WF"
    },
    {
      "name": "Yemen",
      "dial_code": "+967",
      "code": "YE"
    },
    {
      "name": "Zambia",
      "dial_code": "+260",
      "code": "ZM"
    },
    {
      "name": "Zimbabwe",
      "dial_code": "+263",
      "code": "ZW"
    }
  ]
  // country: number;
  // state: any;
  // city: any;

  // // Define the LatLng coordinates for the polygon's  outer path.
  // private polygonCoords = [
  //   { lat: 37.421834, lng: -122.079971 },
  //   { lat: 37.421672, lng: -122.07273 },
  //   { lat: 37.419884, lng: -122.079213 }
  // ];

  // public mapPolygonPaths = [this.polygonCoords];

  // public mapPolygonOptions = {
  //   strokeColor: '#3164bf',
  //   strokeOpacity: 0.8,
  //   strokeWeight: 2,
  //   radius: 200,
  //   fillColor: '#3164bf',
  //   fillOpacity: 0.35,
  //   draggable: true,
  //   center: { lat: 37.421995, lng: -122.084092 }
  // };
  public postalCode = "";
  public postalCodeCustom = "";
  public nearByZipCodes = [];
  public nearByZipCodesCount = 0;

  public searchedLat = 0;
  public searchedLon = 0;

  zipCode: string = '';
  radius: number = 0;
  zipCodes: string[] = [];

  progress: number;
  progressProfile: number;
  progressStart: boolean;
  progressProfileStart: boolean;
  modelSize: "xl";

  constructor(
    private _coreConfigService: CoreConfigService,
    private modalService: NgbModal,
    private userService: UserService,
    private _formBuilder: UntypedFormBuilder,
    private clipboardService: ClipboardService,
    private googleMapsService: GoogleMapsService,
    private authenticationSerive: AuthenticationService,
    private http: HttpClient,
    private toastrService: ToastrService
  ) {
    this.userId = JSON.parse(window.localStorage.getItem('currentUser'))._id;
  }
  ngAfterViewInit(): void {
    // this.getLocation();
  }
  radiusChanged() {
    if (this.circle) {
      console.log(this.circle.getRadius());
    }
  }

  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  public selectedCategories: any = [];
  selectCategory(categryId, midLevelId, subcategry) {
    // if(categry && this.selectedCategories.length > 0){
    //   let indexOf = -1;
    //   this.selectedCategories.find((cat, index)=>{
    //     if(cat._id === categry._id){
    //       indexOf = index;
    //     }
    //   })
    //   if(indexOf != -1 && this.selectedCategories.length > 0 && this.selectedCategories[indexOf]['subCategory'].length  > 0){
    //     let subIndex = -1;
    //     this.selectedCategories[indexOf]['subCategory'].find((subcat, index)=>{
    //       if(subcat._id === subcategry._id){
    //         subIndex = index;
    //       }
    //     })
    //     if(subIndex == -1){
    //       this.selectedCategories[indexOf]['subCategory'].push(subcategry);
    //     }else{
    //       this.selectedCategories[indexOf]['subCategory'].splice(subIndex,1);
    //       if(this.selectedCategories[indexOf]['subCategory'].length <= 0){
    //         this.selectedCategories.splice(indexOf,1);
    //       }
    //     }
    //   }else{
    //     categry['subCategory'] = [];
    //     categry['subCategory'].push(subcategry);
    //     this.selectedCategories.push(categry);
    //   }
    // }else{
    //   categry['subCategory'] = [];
    //   categry['subCategory'].push(subcategry);
    //   this.selectedCategories.push(categry);
    // }

    if (this.selectedCategories && this.selectedCategories.length > 0) {
      let index = -1;
      this.selectedCategories.find((elem, i) => {
        if (elem._id === subcategry._id) {
          index = i;
        }
      })
      if (subcategry && index > -1) {
        this.selectedCategories.splice(index, 1)
      } else {
        let item = subcategry;
        item['categoryId'] = categryId;
        item['midLevelCategoryId'] = midLevelId;
        this.selectedCategories.push(item)
      }
    } else {
      let item = subcategry;
      item['categoryId'] = categryId;
      item['midLevelCategoryId'] = midLevelId;
      this.selectedCategories.push(item)
    }
  }

  saveCategories() {
    let data = {};
    data['userId'] = this.userId;
    data['addCategories'] = this.selectedCategories;

    this.userService.saveSellerCategories(data)
      .subscribe(res => {
        this.selectedCategories = [];
        setTimeout(() => {
          this.modalService.dismissAll();
          this.userService.getSellerCategoriesWithSubCategories(this.userId).subscribe({
            next: (res: any) => {
              this.filterCategories = [];
              this.sellerCategories = res[0]['results'];
              this.sellerCategories.forEach(element => {
                if (this.filterCategories.length <= 0) {
                  let item = element.category;
                  item['subcategory'] = [];
                  item['subcategory'].push(element.subcategory);
                  this.filterCategories.push(item);
                } else {
                  let matchAdded = false;
                  this.filterCategories.forEach(item => {
                    if (item._id === element.category._id) {
                      matchAdded = true;
                      item['subcategory'].push(element.subcategory);
                    }
                  })
                  if (!matchAdded) {
                    let item = element.category;
                    item['subcategory'] = [];
                    item['subcategory'].push(element.subcategory);
                    this.filterCategories.push(item);
                  }
                }
              });
              console.log(this.filterCategories);
            }
          })
        }, 3000)
      })
  }

  getCountries() {

    this.http.get("https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json").subscribe({
      next: (res: any) => {

        this.countriesData = res;

        const country = [...new Set(this.countriesData.map(item => item.country))];
        this.countriesList = country;
      }
    })
  }

  onCountryChangeZipCodes(country: any) {
    this.countryZipCodes = country
    let city = this.countriesData.filter(state => state.country === country);
    city = [...new Set(city.map(item => item.name))];
    city.sort();
    this.countryCitiesZipCode = city;

  }

  onCityChangeZipCodes(city: any) {
    this.cityZipCodes = city
  }

  onCountryChange(country: any) {

    let state = this.countriesData.filter(state => state.country === country);
    state = [...new Set(state.map(item => item.subcountry))];
    state.sort();
    this.countryStates = state;

  }

  onStateChange(state: any) {

    let city = this.countriesData.filter(city => city.subcountry === state);
    city = [...new Set(city.map(item => item.name))];
    city.sort();
    this.countryCities = city;
  }


  onFileChange(event: any) {

    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
    }
  }

  getAllSellerServiceImages() {

    this.userService.getUserSerivesPhotos(this.userId)
      .subscribe(res => {
        this.sellerServicePhotos = res;
      })
  }
  deleteImage(item) {
    this.userService.deleteUserSerivesPhoto(item._id)
      .subscribe(res => {
        this.getAllSellerServiceImages();
      })
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  public show = false;
  public filterCategories = [];
  /**
   * On init
   */
  center: google.maps.LatLngLiteral;

  public countryZipCodes = "";
  public cityZipCodes = "";

  public countryCustom: any;
  public cityCustom: any;

  public PostalCodeCustomArray = [];
  public postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/
    ;
  public CountriesAddCustomArray = [];
  public CitiesAddCustomArray = [];

  getAllCategories() {
    this.userService.getSellerCategoriesWithSubCategories(this.userId).subscribe({
      next: (res: any) => {

        this.sellerCategories = res[0]['results'];

        this.sellerCategories.forEach(element => {

          if (this.filterCategories.length <= 0) {
            let item = element.category;
            item['subcategory'] = [];
            item['subcategory'].push(element.subcategory);
            this.filterCategories.push(item);
          } else {
            let matchAdded = false;
            this.filterCategories.forEach(item => {
              if (item._id === element.category._id) {
                matchAdded = true;
                item['subcategory'].push(element.subcategory);
              }
            })
            if (!matchAdded) {
              let item = element.category;
              item['subcategory'] = [];
              item['subcategory'].push(element.subcategory);
              this.filterCategories.push(item);
            }
          }
        });

      }
    })
  }

  ngOnInit() {
    this.getAllCategories();
    this.getUserAllZipCodes();
    this.getCountries();
    // const mapProperties = {
    //   center: new google.maps.LatLng(36.2271, -80.8431),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    //   };
    // this.map = new google.maps.Map(this.mapElement.nativeElement,    mapProperties);
    // const map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
    //   center: { lat: 37.7749, lng: -122.4194 },
    //   zoom: 8,
    // });
    // const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ address: 'San Francisco' }, (results, status) => {
    //   if (status === 'OK') {
    //     this.center = results[0].geometry.location.toJSON() as google.maps.LatLngLiteral;
    //     this.radius = 10000; // set radius to 10 km
    //     this.getZipCodes(map, this.center, this.sliderWithNgModel);
    //   }
    // });
    this.contentHeader = {
      headerTitle: 'Home',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Sample',
            isLink: false
          }
        ]
      }
    }
    this.profileUpdateFormBuilder();
  }

  zipCodesGet(city: string, country: string, radius: string) {

    const address = `${city}, ${country}`;
    const apiKey = "AIzaSyC1PD_A1j--Aw4F0iRkC5KZsoxexw6mpnI"

    this.http.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: address,
        key: apiKey,
      }
    }).subscribe({
      next: (response: any) => {
        const location = response.results[0].geometry.location;
        return this.getZipCodesByLocation(location, radius, apiKey);
      }
    })
  }

  private getZipCodesByLocation(location: any, radius: string, apiKey: string) {

    this.http.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        latlng: `${location.lat},${location.lng}`,
        result_type: 'postal_code',
        location_type: 'ROOFTOP',
        radius: radius,
        key: apiKey,
      }
    }).subscribe({
      next: (response: any) => {

        const zipCodes = response.results.map(result =>
          result.address_components.find(component => component.types.includes('postal_code')).long_name
        );

      }
    })

  }


  getUserAllZipCodes() {

    const OBJ = {
      userId: this.userId,
    }


    this.progressProfileStart = true
    this.progressProfile = 1;

    // Create a subject to signal when the API call is complete
    const apiResponse$ = new Subject<void>();

    // Simulate progress until API response is received
    const progressSimulator$ = interval(1000).pipe(
      takeUntil(apiResponse$)
    );

    progressSimulator$.subscribe((value) => {
      // Increment progress until 100
      this.progressProfile = Math.min(value + 1, 100); // Ensure progress doesn't exceed 100
    });

    this.userService.getUserZipCodes(OBJ).pipe(
      takeUntil(apiResponse$),
    ).subscribe({
      next: (res) => {
        if (res.data == null || res.data == "null" || res.data == "") {
          this.userSavedZipCodes = ""
        } else {
          this.userSavedZipCodes = res.data.nearByPostalCodes;
        }

        this.getUserAllProfile();

        apiResponse$.next();
        apiResponse$.complete();
        // Optionally, set progress to 100 once the response is complete
        this.progressProfile = 100;
        setTimeout(() => {
          this.progressProfileStart = false;
          this.progressProfile = 0;
        }, 500);
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  onCountryPhoneCode(code: any) {
    this.phoneCode = code.dial_code
  }

  getUserAllProfile() {

    // this.nearByZipCodesCount = 0
    // this.nearByZipCodes = [];

    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {

        this.sellerProfile = res;
        this.searchTypeFind = this.sellerProfile.postalCodeSearchType;
        this.customPostalCodeFromPofile = this.sellerProfile.customPostalCodes;



        if (this.sellerProfile.customCountry.length !== 0) {
          this.CountriesAddCustomArray = this.sellerProfile.customCountry

          if (this.sellerProfile.customCountry[0] == "") {
            this.CountriesAddCustomArray = []
          }

        }

        if (this.sellerProfile.customCity.length !== 0) {
          this.CitiesAddCustomArray = this.sellerProfile.customCity

          if (this.sellerProfile.customCountry[0] == "") {
            this.CitiesAddCustomArray = []
          }
        }

        if (this.sellerProfile.customPostalCodes !== " ") {
          this.PostalCodeCustomArray = this.sellerProfile.customPostalCodes.split(',')

          if (this.sellerProfile.customCountry[0] == "") {
            this.PostalCodeCustomArray = []
          }

        }
        if (this.sellerProfile.postalCode) {

          this.postalCode = this.sellerProfile.postalCode.trim();
        }
        if (this.userSavedZipCodes) {
          let arr = this.userSavedZipCodes.split(',');
          this.nearByZipCodesCount = arr.length

          this.nearByZipCodes = this.userSavedZipCodes.split(',');
        }
        if (this.sellerProfile.radius) {
          if (this.sellerProfile.customPostalCodes !== " ") {
            this.sliderWithNgModel = parseInt("1");
          } else {
            this.sliderWithNgModel = parseInt(this.sellerProfile.radius);
          }
        }

        if (this.sellerProfile.savedLat == 1 || this.sellerProfile.savedLat < 1) {

          this.getLocation();

        } else {

          this.searchedLat = this.sellerProfile.savedLat;
          this.searchedLon = this.sellerProfile.savedLon;

          this.mapCircleCenter = { lat: this.sellerProfile.savedLat, lng: this.sellerProfile.savedLon };
          this.mapCircleOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            radius: this.sliderWithNgModel * 1609.34,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            draggable: true,
            center: { lat: this.sellerProfile.savedLat, lng: this.sellerProfile.savedLon }
          };
          this.markerCirclePolygonCenter = { lat: this.sellerProfile.savedLat, lng: this.sellerProfile.savedLon };

        }

        this.searchedLat = 0;
        this.searchedLon = 0;

        this.profileUpdateFormBuilder();
      }
    })
    // this.selectBasicMethod();
    // this.userService.getAllCategoriesWithSubCategories().subscribe({
    //   next: (res: any)=>{
    //     this.categories = res[0]['results'];
    //   }
    // })

    this.getAllSellerServiceImages();
    this.contentHeader = {
      headerTitle: 'Dashboard',
      actionButton: true,
      headerRight: false,
    }
    this.userService.getProfile(this.userId).subscribe({
      next: (res: any) => {
        this.sellerProfile = res;
        this.profileUpdateFormBuilder();
      }
    })
    // this.profileUpdateFormBuilder();

    this.userService.getAllCategoriesWithSubCategories().subscribe({
      next: (res: any) => {
        const CATEGORIES = res[0]['results'];
        const FILTER_CATEGORIES = CATEGORIES.filter((item) => item.title != "Hotels and Travel");
        this.categories = FILTER_CATEGORIES;
      }
    })

  }

  onSubmitSearch() {

    const Text = this.searchText;
    this.http.get(`https://api.moventag.com/category/getAllSubCategory?q=${Text}`).subscribe({
      next: (res: any) => {
        this.searchSubCategories = res
        console.log(this.searchSubCategories)
      }
    })
  }

  onSubmitClear() {
    this.searchText = "";
    this.searchSubCategories = [];
  }

  modalOpenVC(modalVC) {
    this.myFiles = [];
    this.modalService.open(modalVC, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCProfilePic(modalVCProfilePic) {
    this.modalService.open(modalVCProfilePic, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCCover(modalVCCover) {
    this.modalService.open(modalVCCover, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCChangePass(modalVCChangePass) {
    this.modalService.open(modalVCChangePass, {
      centered: true,
      size: 'sm' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCContactDet(modalVCContactDet) {
    this.modalService.open(modalVCContactDet, {
      centered: true,
      size: 'sm' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalOpenVCAbout(modalVCAbout) {
    this.modalService.open(modalVCAbout, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalOpenVCCategories(modalVCCategories) {
    this.selectedOption = 1
    this.modalService.open(modalVCCategories, {
      centered: true,
      size: 'xl' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
    // this.getLocation();
  }
  profileUpdateFormBuilder() {
    this.profileUpdateForm = this._formBuilder.group({
      companyName: [this.sellerProfile?.companyName ? this.sellerProfile.companyName : '', [Validators.required]],
      description: [this.sellerProfile?.description ? this.sellerProfile.description : '', [Validators.required]],
      termsConditions: [this.sellerProfile?.termsConditions ? this.sellerProfile.termsConditions : '', [Validators.required]],
      companyType: [this.sellerProfile?.companyType ? this.sellerProfile.companyType : '', Validators.required],
      noOfEmployee: [this.sellerProfile?.noOfEmployee ? this.sellerProfile.noOfEmployee : '', Validators.required],
      returnPolicy: [this.sellerProfile?.returnPolicy ? this.sellerProfile.returnPolicy : '', Validators.required],
      liabilityInsurance: [this.sellerProfile?.liabilityInsurance ? this.sellerProfile.liabilityInsurance : false, Validators.required],
      workerCompensation: [this.sellerProfile?.workerCompensation ? this.sellerProfile.workerCompensation : false, Validators.required],
      projectMinimum: [this.sellerProfile?.projectMinimum ? this.sellerProfile.projectMinimum : '', Validators.required],
      bonded: [this.sellerProfile?.bonded ? this.sellerProfile.bonded == 'false' ? "" : this.sellerProfile.bonded : "", Validators.required],
      writtenContract: [this.sellerProfile?.writtenContract ? this.sellerProfile.writtenContract : false, Validators.required],
      address: [this.sellerProfile?.address ? this.sellerProfile.address : '', Validators.required],
      postalCode: [this.sellerProfile?.postalCode ? this.sellerProfile.postalCode : '', Validators.required],
      paymentMethod: [this.sellerProfile?.paymentMethod ? this.sellerProfile.paymentMethod : '', Validators.required],
      warrantyTerms: [this.sellerProfile?.warrantyTerms ? this.sellerProfile.warrantyTerms : '', Validators.required],
      country: [this.sellerProfile?.country ? this.sellerProfile.country : '', Validators.required],
      state: [this.sellerProfile?.state ? this.sellerProfile.state : '', Validators.required],
      city: [this.sellerProfile?.city ? this.sellerProfile.city : '', Validators.required],
    });

    this.sellerWebLinksForm = this._formBuilder.group({
      webURL: [this.sellerProfile?.webURL ? this.sellerProfile.webURL : ''],
      facebookURL: [this.sellerProfile?.facebookURL ? this.sellerProfile.facebookURL : ''],
      instagramURL: [this.sellerProfile?.instagramURL ? this.sellerProfile.instagramURL : ''],
      twitterURL: [this.sellerProfile?.twitterURL ? this.sellerProfile.twitterURL : ''],
      phone: [this.sellerProfile?.phone ? this.sellerProfile.phone : '', Validators.required],
      userEmail: [this.sellerProfile?.email ? this.sellerProfile.email : ''],
    });
  }
  copyText() {
    this.clipboardService.copyFromContent(this.sellerProfile?.referralCode);
  }
  onUpdateLinks() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.sellerWebLinksForm.invalid) {
      return;
    }
    if (this.phoneCode == "") {
      this.toastrService.error('Please select phone code');
      return;
    }

    const OBJ = {

      facebookURL: this.sellerWebLinksForm.value.facebookURL,
      instagramURL: this.sellerWebLinksForm.value.instagramURL,
      phone: this.phoneCode + this.sellerWebLinksForm.value.phone,
      twitterURL: this.sellerWebLinksForm.value.twitterURL,
      webURL: this.sellerWebLinksForm.value.webURL,

      companyName: this.sellerProfile?.companyName,
      description: this.sellerProfile?.description,
      termsConditions: this.sellerProfile?.termsConditions,
      companyType: this.sellerProfile?.companyType,
      noOfEmployee: this.sellerProfile?.noOfEmployee,
      returnPolicy: this.sellerProfile?.returnPolicy,
      liabilityInsurance: this.sellerProfile?.liabilityInsurance,
      workerCompensation: this.sellerProfile?.workerCompensation,
      projectMinimum: this.sellerProfile?.projectMinimum,
      bonded: this.sellerProfile?.bonded,
      writtenContract: this.sellerProfile?.writtenContract,
      address: this.sellerProfile?.address,
      postalCode: this.sellerProfile?.postalCode,
      paymentMethod: this.sellerProfile?.paymentMethod,
      warrantyTerms: this.sellerProfile?.warrantyTerms,
      country: this.sellerProfile?.country,
      state: this.sellerProfile?.state,
      city: this.sellerProfile?.city,
    }

    let data = OBJ;
    data['id'] = this.userId;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.modalService.dismissAll();

        this.getUserAllZipCodes();

        // this.sellerProfile = res;
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  modalEditDetail(modalEditDetail) {
    this.modalService.open(modalEditDetail, {
      centered: true,
      size: 'xl' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }
  modalUpdateCategory(modalUpdateCategory) {
    this.modalService.open(modalUpdateCategory, {
      centered: true,
      size: 'xl' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }

  modalUpdatePhoto(modalUpdatePhoto) {
    this.coverPhotoChangedEvent = '';
    this.coverPhotoCroppedImage = '';
    this.companyPhotoChangedEvent = '';
    this.CompanyPhotoCroppedImage = '';
    this.servicePhotoChangedEvent = '';
    this.servicePhotoCroppedImage = '';
    this.coverPhotoCroppedImageFile = null;
    this.CompanyPhotoCroppedImageFile = null;
    this.servicePhotoCroppedImageFile = null;
    this.modalService.open(modalUpdatePhoto, {
      centered: true,
      size: 'lg' // size: 'xs' | 'sm' | 'lg' | 'xl'
    });
  }


  coverPhotoChangedEvent: any = '';
  coverPhotoCroppedImage: any = '';
  coverPhotoCroppedImageFile: any;

  companyPhotoChangedEvent: any = '';
  CompanyPhotoCroppedImage: any = '';
  CompanyPhotoCroppedImageFile: any;

  servicePhotoChangedEvent: any = '';
  servicePhotoCroppedImage: any = '';
  servicePhotoCroppedImageFile: any;


  coverfileChangeEvent(event: any): void {
    this.coverPhotoChangedEvent = event;
  }

  coverimageCropped(event: ImageCroppedEvent) {
    this.coverPhotoCroppedImage = event.base64;
    this.coverPhotoCroppedImageFile = base64ToFile(this.coverPhotoCroppedImage);
  }
  companyfileChangeEvent(event: any): void {
    this.companyPhotoChangedEvent = event;
  }

  servicefileChangeEvent(event: any): void {
    this.servicePhotoChangedEvent = event;
  }

  companyimageCropped(event: ImageCroppedEvent) {
    this.CompanyPhotoCroppedImage = event.base64;
    this.CompanyPhotoCroppedImageFile = base64ToFile(this.CompanyPhotoCroppedImage);
  }

  serviceImageCropped(event: ImageCroppedEvent) {
    this.servicePhotoCroppedImage = event.base64;
    this.servicePhotoCroppedImageFile = base64ToFile(this.servicePhotoCroppedImage);
  }
  imageLoaded(image?: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.profileUpdateForm.invalid) {
      // return;
    }
    let data = this.profileUpdateForm.value;
    data['id'] = this.userId;

    const OBJ = {
      address: data.address,
      bonded: data.bonded,
      city: data.city,
      companyName: data.companyName,
      companyType: data.companyType,
      country: data.country,
      description: data.description,
      id: data.id,
      liabilityInsurance: data.liabilityInsurance,
      noOfEmployee: data.noOfEmployee,
      paymentMethod: data.paymentMethod,
      postalCode: data.postalCode.toUpperCase(),
      projectMinimum: data.projectMinimum,
      returnPolicy: data.returnPolicy,
      state: data.state,
      termsConditions: data.termsConditions,
      warrantyTerms: data.warrantyTerms,
      workerCompensation: data.workerCompensation,
      writtenContract: data.writtenContract,

      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,
    }

    this.authenticationSerive.updateProfile(OBJ).subscribe({
      next: (res) => {
        console.log(res)
        this.modalService.dismissAll();

        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    })
  }


  onSaveNearByZipCode() {

    this.submitted = true;

    if (this.postalCode === '' || this.nearByZipCodes.length <= 0) {
      return;
    }

    let data = {};

    data['postalCode'] = this.postalCode;
    data['radius'] = this.sliderWithNgModel;
    data['nearByPostalCodes'] = this.nearByZipCodes.toString();
    data['id'] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "NearBy",
      postalCode: this.postalCode,
      radius: this.sliderWithNgModel,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      countryZipCodes: this.countryZipCodes,
      cityZipCodes: this.cityZipCodes,

      customCountry: [],
      customCity: [],

      id: this.userId,

      savedLat: this.searchedLat,
      savedLon: this.searchedLon,

    }

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.saveUserZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  saveUserZipCodes() {

    const OBJ = {
      userId: this.userId,
      nearByPostalCodes: this.nearByZipCodes.toString(),
    }


    this.progressStart = true
    this.progress = 1;

    let queryParam = '?zipcode=' + this.postalCode.toUpperCase() + '&miles=' + this.sliderWithNgModel * 1609.344;

    // Create a subject to signal when the API call is complete
    const apiResponse$ = new Subject<void>();

    // Simulate progress until API response is received
    const progressSimulator$ = interval(1000).pipe(
      takeUntil(apiResponse$)
    );

    progressSimulator$.subscribe((value) => {
      // Increment progress until 100
      this.progress = Math.min(value + 1, 100); // Ensure progress doesn't exceed 100
    });


    this.userService.createUserZipCodes(OBJ).pipe(
      takeUntil(apiResponse$),
    ).subscribe({
      next: (res) => {
        this.modalService.dismissAll();

        this.getUserAllZipCodes();

        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.countryCustom = null;
        this.cityCustom = null;
        this.CountriesAddCustomArray = [];
        this.CitiesAddCustomArray = [];

        this.toastrService.success('Added Successfully!')

        apiResponse$.next();
        apiResponse$.complete();
        // Optionally, set progress to 100 once the response is complete
        this.progress = 100;
        setTimeout(() => {
          this.progressStart = false;
          this.progress = 0;
        }, 500);
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  uploadCoverPhoto() {
    if (this.coverPhotoCroppedImageFile) {

      let data: FormData = new FormData();
      data.append('coverImage', this.coverPhotoCroppedImageFile, 'image/png')

      data.append('facebookURL', this.sellerProfile?.facebookURL)
      data.append('instagramURL', this.sellerProfile?.instagramURL)
      data.append('phone', this.sellerProfile?.phone)
      data.append('twitterURL', this.sellerProfile?.twitterURL)
      data.append('webURL', this.sellerProfile?.webURL)

      data.append('companyName', this.sellerProfile?.companyName)
      data.append('description', this.sellerProfile?.description)
      data.append('termsConditions', this.sellerProfile?.termsConditions)
      data.append('companyType', this.sellerProfile?.companyType)
      data.append('noOfEmployee', this.sellerProfile?.noOfEmployee)
      data.append('returnPolicy', this.sellerProfile?.returnPolicy)
      data.append('liabilityInsurance', this.sellerProfile?.liabilityInsurance)
      data.append('workerCompensation', this.sellerProfile?.workerCompensation)
      data.append('projectMinimum', this.sellerProfile?.projectMinimum)
      data.append('bonded', this.sellerProfile?.bonded)
      data.append('writtenContract', this.sellerProfile?.writtenContract)
      data.append('address', this.sellerProfile?.address)
      data.append('postalCode', this.sellerProfile?.postalCode)
      data.append('paymentMethod', this.sellerProfile?.paymentMethod)
      data.append('warrantyTerms', this.sellerProfile?.warrantyTerms)
      data.append('country', this.sellerProfile?.country)
      data.append('state', this.sellerProfile?.state)
      data.append('city', this.sellerProfile?.city)

      data.append('id', this.userId)
      this.userService.updateCoverPhoto(data).subscribe({
        next: (res) => {
          this.modalService.dismissAll();

          this.getUserAllZipCodes();
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
  }

  uploadProfilePhoto() {
    if (this.CompanyPhotoCroppedImageFile) {
      let data: FormData = new FormData();
      data.append('profileImage', this.CompanyPhotoCroppedImageFile, 'image/png')

      data.append('facebookURL', this.sellerProfile?.facebookURL)
      data.append('instagramURL', this.sellerProfile?.instagramURL)
      data.append('phone', this.sellerProfile?.phone)
      data.append('twitterURL', this.sellerProfile?.twitterURL)
      data.append('webURL', this.sellerProfile?.webURL)

      data.append('companyName', this.sellerProfile?.companyName)
      data.append('description', this.sellerProfile?.description)
      data.append('termsConditions', this.sellerProfile?.termsConditions)
      data.append('companyType', this.sellerProfile?.companyType)
      data.append('noOfEmployee', this.sellerProfile?.noOfEmployee)
      data.append('returnPolicy', this.sellerProfile?.returnPolicy)
      data.append('liabilityInsurance', this.sellerProfile?.liabilityInsurance)
      data.append('workerCompensation', this.sellerProfile?.workerCompensation)
      data.append('projectMinimum', this.sellerProfile?.projectMinimum)
      data.append('bonded', this.sellerProfile?.bonded)
      data.append('writtenContract', this.sellerProfile?.writtenContract)
      data.append('address', this.sellerProfile?.address)
      data.append('postalCode', this.sellerProfile?.postalCode)
      data.append('paymentMethod', this.sellerProfile?.paymentMethod)
      data.append('warrantyTerms', this.sellerProfile?.warrantyTerms)
      data.append('country', this.sellerProfile?.country)
      data.append('state', this.sellerProfile?.state)
      data.append('city', this.sellerProfile?.city)
      
      data.append('id', this.userId)
      this.authenticationSerive.updateProfile(data).subscribe({
        next: (res) => {
          this.modalService.dismissAll();

          this.getUserAllZipCodes();
        },
        error: (err) => {
          console.log(err);
        },
      })
    }
  }
  uploadServicePhotos() {
    const formData = new FormData();
    formData.append("servicePhotos", this.servicePhotoCroppedImageFile, 'image/png');
    formData.append("id", this.userId);
    this.userService.addUserSerivesPhotos(formData)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getAllSellerServiceImages();
      })
  }

  public findCheckOrNot(id) {
    let findIdExists = this.sellerCategories.find(elem => elem.subCategoryId === id);
    if (findIdExists) {
      return true;
    }
    return false;
  }




  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  showPosition(position) {
    const latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: latLng,
      zoom: 10
    });

    const geocoder = new google.maps.Geocoder();
    // geocoder.geocode({ address: latLng }, (results, status) => {
    //   if (status === 'OK') {
    //     this.center = results[0].geometry.location.toJSON() as google.maps.LatLngLiteral;
    //     this.radius = 10000; // set radius to 10 km
    //     this.getZipCodes(this.map, this.center, this.sliderWithNgModel);
    //   }
    // });
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK') {
        const addressComponents = results[0].address_components;
        this.postalCode = addressComponents.find(component => component.types.includes('postal_code')).long_name;
        // this.getZipCodes(this.map, latLng, this.sliderWithNgModel);

        // Do something with the zipCode value
      }
    });


    // Extract the postal codes from the nearby locations
    this.mapCircleCenter = { lat: latLng.lat(), lng: latLng.lng() };
    this.mapCircleOptions = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      radius: this.sliderWithNgModel * 1609.34,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      center: { lat: latLng.lat(), lng: latLng.lng() }
    };
    this.markerCirclePolygonCenter = { lat: latLng.lat(), lng: latLng.lng() };
    // this.getZipCodes(latLng, this.radius);
  }

  // setRadius(radius: number) {
  //   this.radius = radius;
  //   // this.getZipCodes(this.map.center, radius);
  // }
  // getZipCodes(map: google.maps.Map, center: google.maps.LatLngLiteral, radius: number) {
  //   const request = {
  //     location: center,
  //     radius: radius,
  //     type: 'postal_code'
  //   };
  //   const service = new google.maps.places.PlacesService(map);
  //   service.nearbySearch(request, (results, status) => {
  //     if (status === 'OK') {
  //       this.zipCodes = results.map(result => result.postal_code);
  //     }
  //   });
  // }
  // getZipCodes(latLng, radius) {
  //   const request = {
  //     location: latLng,
  //     radius: radius.toString(),
  //     type: ['postal_code']
  //   };

  //   const service = new google.maps.places.PlacesService(this.map);
  //   service.nearbySearch(request, this.callback.bind(this));
  // }

  selectOption(event) {
    this.selectedOption = event;
  }


  callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        const marker = new google.maps.Marker({
          position: place.geometry.location,
          map: this.map
        });
      }
    }
  }

  validatePostalCode(postalCode: string): boolean {
    return this.postalCodePattern.test(postalCode);
  }

  public clicOnItem(item) {

    const index = this.PostalCodeCustomArray.indexOf(item);
    if (index > -1) {
      this.PostalCodeCustomArray.splice(index, 1);
    }

    this.submitted = true;
    // stop here if form is invalid

    let data = {};

    data['postalCode'] = "";
    data['radius'] = 0;
    data['nearByPostalCodes'] = this.PostalCodeCustomArray.toString();
    data['id'] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "Custom",
      postalCode: " ",
      radius: 0,
      customPostalCodes: this.PostalCodeCustomArray.toString(),
      nearByPostalCodes: this.PostalCodeCustomArray.toString(),

      customCountry: [],
      customCity: [],

      savedLat: 1,
      savedLon: 1,

      id: this.userId,

    }

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {

        this.getUserAllZipCodes();
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  public addCustomPostaCodeToArray() {

    if (!this.postalCodeCustom) {
      this.toastrService.error('Please enter valid postal code.')
      return;
    }
    if (!this.validatePostalCode(this.postalCodeCustom)) {
      this.toastrService.error('Please enter valid postal code. \n e.g A1A 1A1')
      return;
    }

    var searchArray = (this.PostalCodeCustomArray.indexOf(this.postalCodeCustom.toLocaleUpperCase()) > -1);

    if (searchArray == true) {
      this.toastrService.error('Already Added');
      return;
    }

    const ARRAY = [];
    ARRAY.push(...this.PostalCodeCustomArray, this.postalCodeCustom.toLocaleUpperCase())
    this.PostalCodeCustomArray = ARRAY

  }

  onCountryChangeCustom(country: any) {

    this.cityCustom = null;

    this.countryCustom = country
    let city = this.countriesData.filter(state => state.country === country);
    city = [...new Set(city.map(item => item.name))];
    city.sort();
    this.countryCitiesCustom = city;

  }

  onCityChangeCustom(city: any) {
    this.cityCustom = city
  }

  public addCustomCountryCityToArray() {

    if (!this.countryCustom) {
      this.toastrService.error('Please select country first.')
      return;
    }

    if (!this.cityCustom) {

      var searchArray = (this.CountriesAddCustomArray.indexOf(this.countryCustom.toLocaleUpperCase()) > -1);

      if (searchArray == true) {
        this.toastrService.error('Country Already Added');
        return;
      }

      const ARRAY = [];
      ARRAY.push(...this.CountriesAddCustomArray, this.countryCustom.toLocaleUpperCase())
      this.CountriesAddCustomArray = ARRAY

    } else {

      var searchArray = (this.CountriesAddCustomArray.indexOf(this.countryCustom.toLocaleUpperCase()) > -1);
      // var searchArrayCity = (this.CitiesAddCustomArray.indexOf(this.cityCustom.toLocaleUpperCase()) > -1);
      var searchArrayCity = this.CitiesAddCustomArray.filter((item) => item.city == this.cityCustom.toLocaleUpperCase());

      if (searchArray == true) {

        if (searchArrayCity.length > 0) {
          this.toastrService.error('City Already Added');
          return;
        }

        const ARRAY_CITY = [];
        const OBJ = {
          country: this.countryCustom.toLocaleUpperCase(),
          city: this.cityCustom.toLocaleUpperCase()
        }
        ARRAY_CITY.push(...this.CitiesAddCustomArray, OBJ);

        const compareObjects = (obj1: any, obj2: any) => {
          return obj1.country === obj2.country && obj1.city === obj2.city;
        };

        let uniqueArrayOfObjects = ARRAY_CITY.filter(
          (value, index, self) => self.findIndex(obj => compareObjects(obj, value)) === index
        );

        this.CitiesAddCustomArray = uniqueArrayOfObjects;

      }

      if (searchArrayCity.length > 0) {
        this.toastrService.error('City Already Added');
        return;
      }

      const ARRAY_COUNTRY = [];
      ARRAY_COUNTRY.push(...this.CountriesAddCustomArray, this.countryCustom.toLocaleUpperCase());
      let uniqueArrayCountry = [...new Set(ARRAY_COUNTRY)];
      this.CountriesAddCustomArray = uniqueArrayCountry;

      const ARRAY_CITY = [];
      const OBJ = {
        country: this.countryCustom.toLocaleUpperCase(),
        city: this.cityCustom.toLocaleUpperCase()
      }
      ARRAY_CITY.push(...this.CitiesAddCustomArray, OBJ);
      const compareObjects = (obj1: any, obj2: any) => {
        return obj1.country === obj2.country && obj1.city === obj2.city;
      };

      let uniqueArrayOfObjects = ARRAY_CITY.filter(
        (value, index, self) => self.findIndex(obj => compareObjects(obj, value)) === index
      );

      this.CitiesAddCustomArray = uniqueArrayOfObjects;


    }

  }

  public removeCustomCountry(item) {

    const index = this.CountriesAddCustomArray.indexOf(item);
    if (index > -1) {
      this.CountriesAddCustomArray.splice(index, 1);
    }

    for (let i = this.CitiesAddCustomArray.length - 1; i >= 0; i--) {
      if (this.CitiesAddCustomArray[i].country === item) {
        this.CitiesAddCustomArray.splice(i, 1);
      }
    }

    this.submitted = true;

    let data = {};

    data['postalCode'] = "";
    data['radius'] = 0;
    data['nearByPostalCodes'] = this.PostalCodeCustomArray.toString();
    data['id'] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "CountryCity",
      postalCode: " ",
      radius: 0,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      customCountry: this.CountriesAddCustomArray,
      customCity: this.CitiesAddCustomArray,

      savedLat: 1,
      savedLon: 1,

      id: this.userId,

    }

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {

        this.postalCode = "";
        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.nearByZipCodesCount = 0;
        this.sliderWithNgModel = 1;
        this.nearByZipCodes = [];

        this.getUserAllZipCodes();

      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  public removeCustomCity(item) {

    const index = this.CitiesAddCustomArray.indexOf(item);
    if (index > -1) {
      this.CitiesAddCustomArray.splice(index, 1);
    }
    this.submitted = true;

    let data = {};

    data['postalCode'] = "";
    data['radius'] = 0;
    data['nearByPostalCodes'] = this.PostalCodeCustomArray.toString();
    data['id'] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "CountryCity",
      postalCode: " ",
      radius: 0,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      customCountry: this.CountriesAddCustomArray,
      customCity: this.CitiesAddCustomArray,

      savedLat: 1,
      savedLon: 1,

      id: this.userId,

    }

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {

        this.postalCode = "";
        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.nearByZipCodesCount = 0;
        this.sliderWithNgModel = 1;
        this.nearByZipCodes = [];

        this.getUserAllZipCodes();

      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  onSaveCustomCountriescities() {

    if (this.CountriesAddCustomArray.length < 1) {
      this.toastrService.error('Please select country first.')
      return;
    }

    const CITIES = [];
    this.CitiesAddCustomArray.map((item) => {
      CITIES.push(item.city)
    })

    setTimeout(() => {
      this.saveCustomCitiesCountries()
    }, 1000);

  }

  saveCustomCitiesCountries() {

    this.submitted = true;

    let data = {};

    data['postalCode'] = "";
    data['radius'] = 0;
    data['nearByPostalCodes'] = this.PostalCodeCustomArray.toString();
    data['id'] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      savedLat: 1,
      savedLon: 1,

      postalCodeSearchType: "CountryCity",
      postalCode: " ",
      radius: 0,
      customPostalCodes: " ",
      nearByPostalCodes: "",

      customCountry: this.CountriesAddCustomArray,
      customCity: this.CitiesAddCustomArray,

      id: this.userId,

    }

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {

        this.modalService.dismissAll();

        this.postalCode = "";
        this.postalCodeCustom = "";
        this.PostalCodeCustomArray = [];
        this.nearByZipCodesCount = 0;
        this.sliderWithNgModel = 1;
        this.nearByZipCodes = [];

        this.searchedLat = 0;
        this.searchedLon = 0;

        this.getUserAllZipCodes();

      },
      error: (err) => {
        console.log(err);
      },
    })
  }


  onSaveCustomPostalCode() {

    if (this.PostalCodeCustomArray.length < 1) {
      this.toastrService.error('Please enter postal code.')
      return;
    }

    if (!this.postalCodeCustom) {
      this.toastrService.error('Please enter postal code.')
      return;
    }

    this.submitted = true;
    // stop here if form is invalid

    let data = {};

    data['postalCode'] = "";
    data['radius'] = 0;
    data['nearByPostalCodes'] = this.PostalCodeCustomArray.toString();
    data['id'] = this.userId;

    const OBJ = {
      address: this.sellerProfile.address,
      bonded: this.sellerProfile.bonded,
      city: this.sellerProfile.city,
      companyName: this.sellerProfile.companyName,
      companyType: this.sellerProfile.companyType,
      country: this.sellerProfile.country,
      description: this.sellerProfile.description,
      liabilityInsurance: this.sellerProfile.liabilityInsurance,
      noOfEmployee: this.sellerProfile.noOfEmployee,
      paymentMethod: this.sellerProfile.paymentMethod,
      projectMinimum: this.sellerProfile.projectMinimum,
      returnPolicy: this.sellerProfile.returnPolicy,
      state: this.sellerProfile.state,
      termsConditions: this.sellerProfile.termsConditions,
      warrantyTerms: this.sellerProfile.warrantyTerms,
      workerCompensation: this.sellerProfile.workerCompensation,
      writtenContract: this.sellerProfile.writtenContract,
      facebookURL: this.sellerProfile.facebookURL,
      instagramURL: this.sellerProfile.instagramURL,
      twitterURL: this.sellerProfile.twitterURL,

      postalCodeSearchType: "Custom",
      postalCode: " ",
      radius: 0,
      customPostalCodes: this.PostalCodeCustomArray.toString(),
      nearByPostalCodes: "",

      customCountry: [],
      customCity: [],

      savedLat: 1,
      savedLon: 1,

      id: this.userId,

    }

    this.userService.updateProfile(OBJ).subscribe({
      next: (res) => {
        this.saveUserZipCodesCustom();
      },
      error: (err) => {
        console.log(err);
      },
    })
  }

  saveUserZipCodesCustom() {

    const OBJ = {
      userId: this.userId,
      nearByPostalCodes: this.PostalCodeCustomArray.toString(),
    }

    this.userService.createUserZipCodes(OBJ).subscribe({
      next: (res) => {
        this.modalService.dismissAll();

        this.countryCustom = null;
        this.cityCustom = null;
        this.CountriesAddCustomArray = [];
        this.CitiesAddCustomArray = [];

        this.getUserAllZipCodes();
        this.toastrService.success('Added Successfully!')
      },
      error: (err) => {
        console.log(err);
      },
    })

  }



  public findNearByPostalCode() {

    // if (!this.countryZipCodes) {
    //   this.toastrService.error('Please select country')
    //   return;
    // }

    // if (!this.cityZipCodes) {
    //   this.toastrService.error('Please select city')
    //   return;
    // }

    if (!this.postalCode) {
      this.toastrService.error('Please enter postal code.')
      return;
    }

    // this.zipCodesGet(this.cityZipCodes, this.countryZipCodes, `${this.sliderWithNgModel * 1000}`);
    // return;

    this.searchTypeFind = "NearBy";
    this.nearByZipCodesCount = 0;
    this.nearByZipCodes = [];

    this.progressStart = true
    this.progress = 1;

    let queryParam = '?zipcode=' + this.postalCode.toUpperCase() + '&miles=' + this.sliderWithNgModel * 1609.344;

    // Create a subject to signal when the API call is complete
    const apiResponse$ = new Subject<void>();

    // Simulate progress until API response is received
    const progressSimulator$ = interval(1000).pipe(
      takeUntil(apiResponse$)
    );

    progressSimulator$.subscribe((value) => {
      // Increment progress until 100
      this.progress = Math.min(value + 1, 100); // Ensure progress doesn't exceed 100
    });

    this.http.get(`${environment.apiUrl}seller-category/get-nearby-zipcode${queryParam}`, {
      reportProgress: true,
      observe: 'events',
    }).pipe(
      takeUntil(apiResponse$),
    )
      .subscribe(
        (event) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const total = event.total || 1;
            const progress = Math.round((100 * event.loaded) / total);
            // Set progress only if it's less than 100
            if (progress < 100) {
              this.progress = progress;
            }
            // Optionally, you can set the progress to 100 once the API response is complete
            // this.progress = progress;
          } else if (event.type === HttpEventType.Response) {

            const DATA = event.body;

            this.nearByZipCodesCount = DATA['count'];
            this.nearByZipCodes = DATA['result'];

            const LAT = DATA['latitude'];
            const LON = DATA['longitude'];

            this.searchedLat = LAT;
            this.searchedLon = LON;

            this.mapCircleCenter = { lat: LAT, lng: LON };
            this.mapCircleOptions = {
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              radius: this.sliderWithNgModel * 1609.34,
              fillColor: '#FF0000',
              fillOpacity: 0.35,
              draggable: true,
              center: { lat: LAT, lng: LON }
            };
            this.markerCirclePolygonCenter = { lat: LAT, lng: LON };

            // Signal that the API response is complete
            apiResponse$.next();
            apiResponse$.complete();
            // Optionally, set progress to 100 once the response is complete
            this.progress = 100;
            setTimeout(() => {
              this.progressStart = false;
              this.progress = 0;
            }, 500);
          }
        },
        (error) => {
          // Handle the error here
          console.error('Error:', error);
          this.progress = 100;
          setTimeout(() => {
            this.progressStart = false;
            this.progress = 0;
          }, 500);
          apiResponse$.error(error); // Notify observers about the error
        }
      );


    // let queryParam = '?zipcode=' + this.postalCode.toUpperCase() + '&miles=' + this.sliderWithNgModel * 1609.344;
    // this.userService.getNearByPostalCode(queryParam)
    //   .subscribe(res => {
    //     this.nearByZipCodesCount = res.count;
    //     this.nearByZipCodes = res.result;

    //   })



    //  Call the getZipCodesInRadius method of the GoogleMapsService
    //  this.googleMapsService.findNearbyZipcodes(this.mapCircleCenter.lat, this.mapCircleCenter.lng, this.sliderWithNgModel)
    //  .then((zipCodes) => {
    //    // Update the zipCodes array with the results
    //    this.zipCodes = zipCodes;
    //  })
    //  .catch((error) => {
    //    console.error(error);
    //    alert('An error occurred. Please try again later.');
    //  });

    //  this.setRadius(this.sliderWithNgModel);
  }
  public isReadMore = true;
  showFullDescription() {
    this.isReadMore = !this.isReadMore
  }
  public isReadMoreTerms = true;
  showFullisTerms() {
    this.isReadMoreTerms = !this.isReadMoreTerms
  }
}
