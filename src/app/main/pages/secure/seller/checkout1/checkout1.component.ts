import { Component, OnInit, AfterContentChecked } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CoreConfigService } from "@core/services/config.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { UserService } from "@core/services/services/user.service";
import { AuthenticationService } from "@core/services/authentication.service";
import { HttpClient } from "@angular/common/http";
import { FormControl, Validators } from "@angular/forms";
import { StripeService } from "./stripe.service";

@Component({
  selector: "app-checkout1",
  templateUrl: "./checkout1.component.html",
  styleUrls: ["./checkout1.component.scss"],
})
export class Checkout1Component implements OnInit, AfterContentChecked {
  // public
  agreeToTerms = new FormControl(false, Validators.requiredTrue);
  public contentHeader: object;
  public navbar: object;
  public sellerProfile: any;
  country: number;
  lastName = "";
  firstName = "";
  countryName = "";
  phoneCode = "+1";
  isLoading = "false";
  phone = "";
  cvc = "";
  cardNumber = "";
  cardname = "";
  public isAfterSingup = false;
  countryId = [
    { id: 1, name: "United States" },
    { id: 2, name: "Canada" },
    { id: 3, name: "India" },
    { id: 4, name: "Pakistan" },
  ];
  user = null;
  public countriesData: any;
  public countriesList = [];
  public getSellerProfile = true;
  public subscriptionPacakge = false;
  public cardDetail = false;
  public postalCode = "";
  // private stripe: any;

  // public
  selectedMonth: number;
  selectedYear: number;
  radioModel = 1;
  months = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3" },
    { id: 4, name: "4" },
    { id: 5, name: "5" },
    { id: 6, name: "6" },
    { id: 7, name: "7" },
    { id: 8, name: "8" },
    { id: 9, name: "9" },
    { id: 10, name: "10" },
    { id: 11, name: "11" },
    { id: 12, name: "12" },
  ];
  years = [
    { id: 2023, name: "2023" },
    { id: 2024, name: "2024" },
    { id: 2025, name: "2025" },
    { id: 2026, name: "2026" },
    { id: 2027, name: "2027" },
    { id: 2028, name: "2028" },
    { id: 2029, name: "2029" },
    { id: 2030, name: "2030" },
    { id: 2031, name: "2031" },
    { id: 2032, name: "2032" },
    { id: 2033, name: "2033" },
    { id: 2034, name: "2034" },
  ];
  countryCode = [
    {
      name: "Afghanistan",
      dial_code: "+93",
      code: "AF",
    },
    {
      name: "Aland Islands",
      dial_code: "+358",
      code: "AX",
    },
    {
      name: "Albania",
      dial_code: "+355",
      code: "AL",
    },
    {
      name: "Algeria",
      dial_code: "+213",
      code: "DZ",
    },
    {
      name: "AmericanSamoa",
      dial_code: "+1684",
      code: "AS",
    },
    {
      name: "Andorra",
      dial_code: "+376",
      code: "AD",
    },
    {
      name: "Angola",
      dial_code: "+244",
      code: "AO",
    },
    {
      name: "Anguilla",
      dial_code: "+1264",
      code: "AI",
    },
    {
      name: "Antarctica",
      dial_code: "+672",
      code: "AQ",
    },
    {
      name: "Antigua and Barbuda",
      dial_code: "+1268",
      code: "AG",
    },
    {
      name: "Argentina",
      dial_code: "+54",
      code: "AR",
    },
    {
      name: "Armenia",
      dial_code: "+374",
      code: "AM",
    },
    {
      name: "Aruba",
      dial_code: "+297",
      code: "AW",
    },
    {
      name: "Australia",
      dial_code: "+61",
      code: "AU",
    },
    {
      name: "Austria",
      dial_code: "+43",
      code: "AT",
    },
    {
      name: "Azerbaijan",
      dial_code: "+994",
      code: "AZ",
    },
    {
      name: "Bahamas",
      dial_code: "+1242",
      code: "BS",
    },
    {
      name: "Bahrain",
      dial_code: "+973",
      code: "BH",
    },
    {
      name: "Bangladesh",
      dial_code: "+880",
      code: "BD",
    },
    {
      name: "Barbados",
      dial_code: "+1246",
      code: "BB",
    },
    {
      name: "Belarus",
      dial_code: "+375",
      code: "BY",
    },
    {
      name: "Belgium",
      dial_code: "+32",
      code: "BE",
    },
    {
      name: "Belize",
      dial_code: "+501",
      code: "BZ",
    },
    {
      name: "Benin",
      dial_code: "+229",
      code: "BJ",
    },
    {
      name: "Bermuda",
      dial_code: "+1441",
      code: "BM",
    },
    {
      name: "Bhutan",
      dial_code: "+975",
      code: "BT",
    },
    {
      name: "Bolivia, Plurinational State of",
      dial_code: "+591",
      code: "BO",
    },
    {
      name: "Bosnia and Herzegovina",
      dial_code: "+387",
      code: "BA",
    },
    {
      name: "Botswana",
      dial_code: "+267",
      code: "BW",
    },
    {
      name: "Brazil",
      dial_code: "+55",
      code: "BR",
    },
    {
      name: "British Indian Ocean Territory",
      dial_code: "+246",
      code: "IO",
    },
    {
      name: "Brunei Darussalam",
      dial_code: "+673",
      code: "BN",
    },
    {
      name: "Bulgaria",
      dial_code: "+359",
      code: "BG",
    },
    {
      name: "Burkina Faso",
      dial_code: "+226",
      code: "BF",
    },
    {
      name: "Burundi",
      dial_code: "+257",
      code: "BI",
    },
    {
      name: "Cambodia",
      dial_code: "+855",
      code: "KH",
    },
    {
      name: "Cameroon",
      dial_code: "+237",
      code: "CM",
    },
    {
      name: "Canada",
      dial_code: "+1",
      code: "CA",
    },
    {
      name: "Cape Verde",
      dial_code: "+238",
      code: "CV",
    },
    {
      name: "Cayman Islands",
      dial_code: "+ 345",
      code: "KY",
    },
    {
      name: "Central African Republic",
      dial_code: "+236",
      code: "CF",
    },
    {
      name: "Chad",
      dial_code: "+235",
      code: "TD",
    },
    {
      name: "Chile",
      dial_code: "+56",
      code: "CL",
    },
    {
      name: "China",
      dial_code: "+86",
      code: "CN",
    },
    {
      name: "Christmas Island",
      dial_code: "+61",
      code: "CX",
    },
    {
      name: "Cocos (Keeling) Islands",
      dial_code: "+61",
      code: "CC",
    },
    {
      name: "Colombia",
      dial_code: "+57",
      code: "CO",
    },
    {
      name: "Comoros",
      dial_code: "+269",
      code: "KM",
    },
    {
      name: "Congo",
      dial_code: "+242",
      code: "CG",
    },
    {
      name: "Congo, The Democratic Republic of the Congo",
      dial_code: "+243",
      code: "CD",
    },
    {
      name: "Cook Islands",
      dial_code: "+682",
      code: "CK",
    },
    {
      name: "Costa Rica",
      dial_code: "+506",
      code: "CR",
    },
    {
      name: "Cote d'Ivoire",
      dial_code: "+225",
      code: "CI",
    },
    {
      name: "Croatia",
      dial_code: "+385",
      code: "HR",
    },
    {
      name: "Cuba",
      dial_code: "+53",
      code: "CU",
    },
    {
      name: "Cyprus",
      dial_code: "+357",
      code: "CY",
    },
    {
      name: "Czech Republic",
      dial_code: "+420",
      code: "CZ",
    },
    {
      name: "Denmark",
      dial_code: "+45",
      code: "DK",
    },
    {
      name: "Djibouti",
      dial_code: "+253",
      code: "DJ",
    },
    {
      name: "Dominica",
      dial_code: "+1767",
      code: "DM",
    },
    {
      name: "Dominican Republic",
      dial_code: "+1849",
      code: "DO",
    },
    {
      name: "Ecuador",
      dial_code: "+593",
      code: "EC",
    },
    {
      name: "Egypt",
      dial_code: "+20",
      code: "EG",
    },
    {
      name: "El Salvador",
      dial_code: "+503",
      code: "SV",
    },
    {
      name: "Equatorial Guinea",
      dial_code: "+240",
      code: "GQ",
    },
    {
      name: "Eritrea",
      dial_code: "+291",
      code: "ER",
    },
    {
      name: "Estonia",
      dial_code: "+372",
      code: "EE",
    },
    {
      name: "Ethiopia",
      dial_code: "+251",
      code: "ET",
    },
    {
      name: "Falkland Islands (Malvinas)",
      dial_code: "+500",
      code: "FK",
    },
    {
      name: "Faroe Islands",
      dial_code: "+298",
      code: "FO",
    },
    {
      name: "Fiji",
      dial_code: "+679",
      code: "FJ",
    },
    {
      name: "Finland",
      dial_code: "+358",
      code: "FI",
    },
    {
      name: "France",
      dial_code: "+33",
      code: "FR",
    },
    {
      name: "French Guiana",
      dial_code: "+594",
      code: "GF",
    },
    {
      name: "French Polynesia",
      dial_code: "+689",
      code: "PF",
    },
    {
      name: "Gabon",
      dial_code: "+241",
      code: "GA",
    },
    {
      name: "Gambia",
      dial_code: "+220",
      code: "GM",
    },
    {
      name: "Georgia",
      dial_code: "+995",
      code: "GE",
    },
    {
      name: "Germany",
      dial_code: "+49",
      code: "DE",
    },
    {
      name: "Ghana",
      dial_code: "+233",
      code: "GH",
    },
    {
      name: "Gibraltar",
      dial_code: "+350",
      code: "GI",
    },
    {
      name: "Greece",
      dial_code: "+30",
      code: "GR",
    },
    {
      name: "Greenland",
      dial_code: "+299",
      code: "GL",
    },
    {
      name: "Grenada",
      dial_code: "+1473",
      code: "GD",
    },
    {
      name: "Guadeloupe",
      dial_code: "+590",
      code: "GP",
    },
    {
      name: "Guam",
      dial_code: "+1671",
      code: "GU",
    },
    {
      name: "Guatemala",
      dial_code: "+502",
      code: "GT",
    },
    {
      name: "Guernsey",
      dial_code: "+44",
      code: "GG",
    },
    {
      name: "Guinea",
      dial_code: "+224",
      code: "GN",
    },
    {
      name: "Guinea-Bissau",
      dial_code: "+245",
      code: "GW",
    },
    {
      name: "Guyana",
      dial_code: "+595",
      code: "GY",
    },
    {
      name: "Haiti",
      dial_code: "+509",
      code: "HT",
    },
    {
      name: "Holy See (Vatican City State)",
      dial_code: "+379",
      code: "VA",
    },
    {
      name: "Honduras",
      dial_code: "+504",
      code: "HN",
    },
    {
      name: "Hong Kong",
      dial_code: "+852",
      code: "HK",
    },
    {
      name: "Hungary",
      dial_code: "+36",
      code: "HU",
    },
    {
      name: "Iceland",
      dial_code: "+354",
      code: "IS",
    },
    {
      name: "India",
      dial_code: "+91",
      code: "IN",
    },
    {
      name: "Indonesia",
      dial_code: "+62",
      code: "ID",
    },
    {
      name: "Iran, Islamic Republic of Persian Gulf",
      dial_code: "+98",
      code: "IR",
    },
    {
      name: "Iraq",
      dial_code: "+964",
      code: "IQ",
    },
    {
      name: "Ireland",
      dial_code: "+353",
      code: "IE",
    },
    {
      name: "Isle of Man",
      dial_code: "+44",
      code: "IM",
    },
    {
      name: "Israel",
      dial_code: "+972",
      code: "IL",
    },
    {
      name: "Italy",
      dial_code: "+39",
      code: "IT",
    },
    {
      name: "Jamaica",
      dial_code: "+1876",
      code: "JM",
    },
    {
      name: "Japan",
      dial_code: "+81",
      code: "JP",
    },
    {
      name: "Jersey",
      dial_code: "+44",
      code: "JE",
    },
    {
      name: "Jordan",
      dial_code: "+962",
      code: "JO",
    },
    {
      name: "Kazakhstan",
      dial_code: "+77",
      code: "KZ",
    },
    {
      name: "Kenya",
      dial_code: "+254",
      code: "KE",
    },
    {
      name: "Kiribati",
      dial_code: "+686",
      code: "KI",
    },
    {
      name: "Korea, Democratic People's Republic of Korea",
      dial_code: "+850",
      code: "KP",
    },
    {
      name: "Korea, Republic of South Korea",
      dial_code: "+82",
      code: "KR",
    },
    {
      name: "Kuwait",
      dial_code: "+965",
      code: "KW",
    },
    {
      name: "Kyrgyzstan",
      dial_code: "+996",
      code: "KG",
    },
    {
      name: "Laos",
      dial_code: "+856",
      code: "LA",
    },
    {
      name: "Latvia",
      dial_code: "+371",
      code: "LV",
    },
    {
      name: "Lebanon",
      dial_code: "+961",
      code: "LB",
    },
    {
      name: "Lesotho",
      dial_code: "+266",
      code: "LS",
    },
    {
      name: "Liberia",
      dial_code: "+231",
      code: "LR",
    },
    {
      name: "Libyan Arab Jamahiriya",
      dial_code: "+218",
      code: "LY",
    },
    {
      name: "Liechtenstein",
      dial_code: "+423",
      code: "LI",
    },
    {
      name: "Lithuania",
      dial_code: "+370",
      code: "LT",
    },
    {
      name: "Luxembourg",
      dial_code: "+352",
      code: "LU",
    },
    {
      name: "Macao",
      dial_code: "+853",
      code: "MO",
    },
    {
      name: "Macedonia",
      dial_code: "+389",
      code: "MK",
    },
    {
      name: "Madagascar",
      dial_code: "+261",
      code: "MG",
    },
    {
      name: "Malawi",
      dial_code: "+265",
      code: "MW",
    },
    {
      name: "Malaysia",
      dial_code: "+60",
      code: "MY",
    },
    {
      name: "Maldives",
      dial_code: "+960",
      code: "MV",
    },
    {
      name: "Mali",
      dial_code: "+223",
      code: "ML",
    },
    {
      name: "Malta",
      dial_code: "+356",
      code: "MT",
    },
    {
      name: "Marshall Islands",
      dial_code: "+692",
      code: "MH",
    },
    {
      name: "Martinique",
      dial_code: "+596",
      code: "MQ",
    },
    {
      name: "Mauritania",
      dial_code: "+222",
      code: "MR",
    },
    {
      name: "Mauritius",
      dial_code: "+230",
      code: "MU",
    },
    {
      name: "Mayotte",
      dial_code: "+262",
      code: "YT",
    },
    {
      name: "Mexico",
      dial_code: "+52",
      code: "MX",
    },
    {
      name: "Micronesia, Federated States of Micronesia",
      dial_code: "+691",
      code: "FM",
    },
    {
      name: "Moldova",
      dial_code: "+373",
      code: "MD",
    },
    {
      name: "Monaco",
      dial_code: "+377",
      code: "MC",
    },
    {
      name: "Mongolia",
      dial_code: "+976",
      code: "MN",
    },
    {
      name: "Montenegro",
      dial_code: "+382",
      code: "ME",
    },
    {
      name: "Montserrat",
      dial_code: "+1664",
      code: "MS",
    },
    {
      name: "Morocco",
      dial_code: "+212",
      code: "MA",
    },
    {
      name: "Mozambique",
      dial_code: "+258",
      code: "MZ",
    },
    {
      name: "Myanmar",
      dial_code: "+95",
      code: "MM",
    },
    {
      name: "Namibia",
      dial_code: "+264",
      code: "NA",
    },
    {
      name: "Nauru",
      dial_code: "+674",
      code: "NR",
    },
    {
      name: "Nepal",
      dial_code: "+977",
      code: "NP",
    },
    {
      name: "Netherlands",
      dial_code: "+31",
      code: "NL",
    },
    {
      name: "Netherlands Antilles",
      dial_code: "+599",
      code: "AN",
    },
    {
      name: "New Caledonia",
      dial_code: "+687",
      code: "NC",
    },
    {
      name: "New Zealand",
      dial_code: "+64",
      code: "NZ",
    },
    {
      name: "Nicaragua",
      dial_code: "+505",
      code: "NI",
    },
    {
      name: "Niger",
      dial_code: "+227",
      code: "NE",
    },
    {
      name: "Nigeria",
      dial_code: "+234",
      code: "NG",
    },
    {
      name: "Niue",
      dial_code: "+683",
      code: "NU",
    },
    {
      name: "Norfolk Island",
      dial_code: "+672",
      code: "NF",
    },
    {
      name: "Northern Mariana Islands",
      dial_code: "+1670",
      code: "MP",
    },
    {
      name: "Norway",
      dial_code: "+47",
      code: "NO",
    },
    {
      name: "Oman",
      dial_code: "+968",
      code: "OM",
    },
    {
      name: "Pakistan",
      dial_code: "+92",
      code: "PK",
    },
    {
      name: "Palau",
      dial_code: "+680",
      code: "PW",
    },
    {
      name: "Palestinian Territory, Occupied",
      dial_code: "+970",
      code: "PS",
    },
    {
      name: "Panama",
      dial_code: "+507",
      code: "PA",
    },
    {
      name: "Papua New Guinea",
      dial_code: "+675",
      code: "PG",
    },
    {
      name: "Paraguay",
      dial_code: "+595",
      code: "PY",
    },
    {
      name: "Peru",
      dial_code: "+51",
      code: "PE",
    },
    {
      name: "Philippines",
      dial_code: "+63",
      code: "PH",
    },
    {
      name: "Pitcairn",
      dial_code: "+872",
      code: "PN",
    },
    {
      name: "Poland",
      dial_code: "+48",
      code: "PL",
    },
    {
      name: "Portugal",
      dial_code: "+351",
      code: "PT",
    },
    {
      name: "Puerto Rico",
      dial_code: "+1939",
      code: "PR",
    },
    {
      name: "Qatar",
      dial_code: "+974",
      code: "QA",
    },
    {
      name: "Romania",
      dial_code: "+40",
      code: "RO",
    },
    {
      name: "Russia",
      dial_code: "+7",
      code: "RU",
    },
    {
      name: "Rwanda",
      dial_code: "+250",
      code: "RW",
    },
    {
      name: "Reunion",
      dial_code: "+262",
      code: "RE",
    },
    {
      name: "Saint Barthelemy",
      dial_code: "+590",
      code: "BL",
    },
    {
      name: "Saint Helena, Ascension and Tristan Da Cunha",
      dial_code: "+290",
      code: "SH",
    },
    {
      name: "Saint Kitts and Nevis",
      dial_code: "+1869",
      code: "KN",
    },
    {
      name: "Saint Lucia",
      dial_code: "+1758",
      code: "LC",
    },
    {
      name: "Saint Martin",
      dial_code: "+590",
      code: "MF",
    },
    {
      name: "Saint Pierre and Miquelon",
      dial_code: "+508",
      code: "PM",
    },
    {
      name: "Saint Vincent and the Grenadines",
      dial_code: "+1784",
      code: "VC",
    },
    {
      name: "Samoa",
      dial_code: "+685",
      code: "WS",
    },
    {
      name: "San Marino",
      dial_code: "+378",
      code: "SM",
    },
    {
      name: "Sao Tome and Principe",
      dial_code: "+239",
      code: "ST",
    },
    {
      name: "Saudi Arabia",
      dial_code: "+966",
      code: "SA",
    },
    {
      name: "Senegal",
      dial_code: "+221",
      code: "SN",
    },
    {
      name: "Serbia",
      dial_code: "+381",
      code: "RS",
    },
    {
      name: "Seychelles",
      dial_code: "+248",
      code: "SC",
    },
    {
      name: "Sierra Leone",
      dial_code: "+232",
      code: "SL",
    },
    {
      name: "Singapore",
      dial_code: "+65",
      code: "SG",
    },
    {
      name: "Slovakia",
      dial_code: "+421",
      code: "SK",
    },
    {
      name: "Slovenia",
      dial_code: "+386",
      code: "SI",
    },
    {
      name: "Solomon Islands",
      dial_code: "+677",
      code: "SB",
    },
    {
      name: "Somalia",
      dial_code: "+252",
      code: "SO",
    },
    {
      name: "South Africa",
      dial_code: "+27",
      code: "ZA",
    },
    {
      name: "South Sudan",
      dial_code: "+211",
      code: "SS",
    },
    {
      name: "South Georgia and the South Sandwich Islands",
      dial_code: "+500",
      code: "GS",
    },
    {
      name: "Spain",
      dial_code: "+34",
      code: "ES",
    },
    {
      name: "Sri Lanka",
      dial_code: "+94",
      code: "LK",
    },
    {
      name: "Sudan",
      dial_code: "+249",
      code: "SD",
    },
    {
      name: "Suriname",
      dial_code: "+597",
      code: "SR",
    },
    {
      name: "Svalbard and Jan Mayen",
      dial_code: "+47",
      code: "SJ",
    },
    {
      name: "Swaziland",
      dial_code: "+268",
      code: "SZ",
    },
    {
      name: "Sweden",
      dial_code: "+46",
      code: "SE",
    },
    {
      name: "Switzerland",
      dial_code: "+41",
      code: "CH",
    },
    {
      name: "Syrian Arab Republic",
      dial_code: "+963",
      code: "SY",
    },
    {
      name: "Taiwan",
      dial_code: "+886",
      code: "TW",
    },
    {
      name: "Tajikistan",
      dial_code: "+992",
      code: "TJ",
    },
    {
      name: "Tanzania, United Republic of Tanzania",
      dial_code: "+255",
      code: "TZ",
    },
    {
      name: "Thailand",
      dial_code: "+66",
      code: "TH",
    },
    {
      name: "Timor-Leste",
      dial_code: "+670",
      code: "TL",
    },
    {
      name: "Togo",
      dial_code: "+228",
      code: "TG",
    },
    {
      name: "Tokelau",
      dial_code: "+690",
      code: "TK",
    },
    {
      name: "Tonga",
      dial_code: "+676",
      code: "TO",
    },
    {
      name: "Trinidad and Tobago",
      dial_code: "+1868",
      code: "TT",
    },
    {
      name: "Tunisia",
      dial_code: "+216",
      code: "TN",
    },
    {
      name: "Turkey",
      dial_code: "+90",
      code: "TR",
    },
    {
      name: "Turkmenistan",
      dial_code: "+993",
      code: "TM",
    },
    {
      name: "Turks and Caicos Islands",
      dial_code: "+1649",
      code: "TC",
    },
    {
      name: "Tuvalu",
      dial_code: "+688",
      code: "TV",
    },
    {
      name: "Uganda",
      dial_code: "+256",
      code: "UG",
    },
    {
      name: "Ukraine",
      dial_code: "+380",
      code: "UA",
    },
    {
      name: "United Arab Emirates",
      dial_code: "+971",
      code: "AE",
    },
    {
      name: "United Kingdom",
      dial_code: "+44",
      code: "GB",
    },
    {
      name: "United States",
      dial_code: "+1",
      code: "US",
    },
    {
      name: "Uruguay",
      dial_code: "+598",
      code: "UY",
    },
    {
      name: "Uzbekistan",
      dial_code: "+998",
      code: "UZ",
    },
    {
      name: "Vanuatu",
      dial_code: "+678",
      code: "VU",
    },
    {
      name: "Venezuela, Bolivarian Republic of Venezuela",
      dial_code: "+58",
      code: "VE",
    },
    {
      name: "Vietnam",
      dial_code: "+84",
      code: "VN",
    },
    {
      name: "Virgin Islands, British",
      dial_code: "+1284",
      code: "VG",
    },
    {
      name: "Virgin Islands, U.S.",
      dial_code: "+1340",
      code: "VI",
    },
    {
      name: "Wallis and Futuna",
      dial_code: "+681",
      code: "WF",
    },
    {
      name: "Yemen",
      dial_code: "+967",
      code: "YE",
    },
    {
      name: "Zambia",
      dial_code: "+260",
      code: "ZM",
    },
    {
      name: "Zimbabwe",
      dial_code: "+263",
      code: "ZW",
    },
  ];
  checkboxModel = {
    left: true,
    middle: false,
    right: false,
  };

  licensePhotoChangedEvent: any = "";
  licensePhotoChangedEventTYPE: any = "";
  libilityInsurancePhotoChangedEvent: any = "";
  libilityInsurancePhotoChangedEventTYPE: any = "";
  IdentityCardPhotoChangedEvent: any = "";
  IdentityCardPhotoChangedEventTYPE: any = "";

  constructor(
    private stripeService: StripeService,
    private _coreConfigService: CoreConfigService,
    private http: HttpClient,
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private toastrService: ToastrService,
    private userService: UserService
  ) {
    // this.stripe = Stripe('pk_test_krO93K0IJTYIZQI4Kji8oDtK'); // Replace with your Stripe public key
    this.user =
      (window.localStorage.getItem("currentUser") &&
        JSON.parse(window.localStorage.getItem("currentUser"))) ||
      (window.sessionStorage.getItem("currentUser") &&
        JSON.parse(window.sessionStorage.getItem("currentUser")));
    if (window.sessionStorage.getItem("currentUser")) {
      window.sessionStorage.removeItem("currentUser");
      this.isAfterSingup = true;
    }
    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  licensefileChangeEvent(event: any): void {
    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.licensePhotoChangedEvent = event.target.files[0];
      this.licensePhotoChangedEventTYPE = event.target.files[0].type;
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  libilityInsurancefileChangeEvent(event: any): void {
    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.libilityInsurancePhotoChangedEvent = event.target.files[0];
      this.libilityInsurancePhotoChangedEventTYPE = event.target.files[0].type;
      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }

  IdentityCardfileChangeEvent(event: any): void {
    if (
      event.target.files[0].type === "application/pdf" ||
      event.target.files[0].type === "image/jpeg" ||
      event.target.files[0].type === "image/png"
    ) {
      this.IdentityCardPhotoChangedEvent = event.target.files[0];
      this.IdentityCardPhotoChangedEventTYPE = event.target.files[0].type;

      return;
    } else {
      this.toastrService.error(
        "Please select correct format of file (PDF, PNG, JPG)"
      );
    }
  }
  /**
   * On init
   */

  async ngOnInit() {
    this.contentHeader = {
      headerTitle: "Dashboard",
      actionButton: false,
      headerRight: false,
    };
    this.navbar = {
      hidden: false,
    };
    this.isLoading = "true";
    this.userService.getProfile(this.user._id).subscribe({
      next: (res: any) => {
        if (res.phoneCode && res.phone && res.country) {
          this.licensePhotoChangedEvent = null;
          this.libilityInsurancePhotoChangedEvent = null;
          this.IdentityCardPhotoChangedEvent = null;
          this.getSellerProfile = false;
          this.subscriptionPacakge = false;
          this.cardDetail = true;
          this.isLoading = "false";
        } else {
          this.isLoading = "false";
        }
      },
    });

    this.getCountries();
    this.generateToken();
  }

  async generateToken() {
    const stripe = await this.stripeService.createStripe();
    const cardElement = await this.stripeService.createCardElement();
    cardElement.mount("#card-element");

    const submitButton = document.getElementById("submit");
    if (submitButton) {
      submitButton.addEventListener("click", async () => {
        if (!this.agreeToTerms.valid) {
          this.toastrService.error(
            "Please accept Terms & Conditions",
            "Terms & Conditions"
          );
          return;
        }

        const tokenResult = (await this.stripeService.createToken(
          cardElement
        )) as { token: { id: string; card: { id: string } } } | string;

        if (typeof tokenResult === "string") {
          console.log("Error generating token");
        } else {
          let subscriptionData = {
            _id: this.user._id,
            email: this.user.email,
            name: this.user.companyName,
            token: tokenResult.token.id,
            firstName: this.firstName,
            lastName: this.lastName,
            country: this.country,
            postalCode: this.postalCode,
            phone: this.phone,
            priceId: this.priceId,
            free_trial: this.free_trial,
          };
          this.userService
            .createSubscriptionCustomer(subscriptionData)
            .subscribe({
              next: (res) => {
                console.log("=================");
                console.log(res);
                console.log("=================");
                console.log(res.status);
                if (res.status === "incomplete") {
                  let body = {
                    _id: this.user._id,
                  };
                  this.userService.sendEmailOnCardDecline(body).subscribe({
                    next: (value) => {},
                  });
                }

                let data = {
                  _id: this.user._id,
                  paymentMethodId: tokenResult.token.card.id,
                };
                this.userService.setPaymentMethodAsDefault(data).subscribe({
                  next: (value) => {
                    console.log("=================111");
                    console.log(value);
                    console.log("=================111");
                  },
                });

                if (this.isAfterSingup) {
                  const OBJ = {
                    userId: this.user._id,
                    purchaseAmount: this.total,
                  };

                  this.userService.affMakePurchase(OBJ).subscribe({
                    next: (value) => {
                      console.log("=================111222");
                      console.log(value);
                      console.log("=================111222");
                    },
                  });

                  this.toastrService.success(
                    "You have successfully subscribed."
                  );
                  this._router.navigate(["/pages/seller/home"]);
                  // this._router.navigate(['/login']);
                } else {
                  const OBJ = {
                    userId: this.user._id,
                    purchaseAmount: this.total,
                  };

                  this.userService.affMakePurchase(OBJ).subscribe({
                    next: (value) => {},
                  });

                  this.user["payment"] = true;
                  this._authenticationService.updateUserData(this.user);
                  this._router.navigate(["/pages/seller/home"]);
                }
              },
              error: (err) => {
                let body = {
                  _id: this.user._id,
                };
                this.userService.sendEmailOnCardDecline(body).subscribe({
                  next: (value) => {},
                });
              },
            });
        }
      });
    } else {
      console.error("Submit button not found.");
    }
  }

  getCountries() {
    this.http
      .get(
        "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
      )
      .subscribe({
        next: (res: any) => {
          this.countriesData = res;

          const country = [
            ...new Set(this.countriesData.map((item) => item.country)),
          ];
          this.countriesList = country;
        },
      });
  }

  onCountryChange(country: any) {
    this.countryName = country;
  }

  onCountryPhoneCode(code: any) {
    this.phoneCode = code.dial_code;
  }

  async ngAfterViewInit(): Promise<void> {
    this.sellerProfile = this.sellerProfile;
  }

  async ngAfterContentChecked(): Promise<void> {
    if (this.cardDetail && !this.cardElementMounted) {
      this.mountCardElement();
      this.cardElementMounted = true;
    }

    this.sellerProfile = this.sellerProfile;
  }

  private cardElementMounted = false;

  private async mountCardElement() {
    if (!this.cardElementMounted) {
      const stripe = await this.stripeService.createStripe();
      const cardElement = await this.stripeService.createCardElement();
      cardElement.mount("#card-element");
      this.cardElementMounted = true;
      this.generateToken();
    }
  }

  logout() {
    this._authenticationService.logout();
    this._router.navigate(["/login"]);
  }

  public userProfile: any = {};

  updateUserProfile() {
    let data = this.userProfile;
    data["id"] = this.user;
    this.userService.updateProfile(data).subscribe({
      next: (res) => {
        this.userProfile = JSON.parse(JSON.stringify(res));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  goToNextStep() {
    if (this.phoneCode && this.phone && this.countryName) {
      let data = this.userProfile;
      data["id"] = this.user;

      const OBJ = {
        id: this.user._id,
        phoneCode: this.phoneCode,
        phone: this.phone,
        country: this.countryName,
      };

      this.userService.updateProfile(OBJ).subscribe({
        next: (res) => {
          this.userProfile = JSON.parse(JSON.stringify(res));

          this.licensePhotoChangedEvent = null;
          this.libilityInsurancePhotoChangedEvent = null;
          this.IdentityCardPhotoChangedEvent = null;
          this.getSellerProfile = false;
          this.subscriptionPacakge = false;
          this.cardDetail = true;
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.toastrService.error("Please enter all fields.", "");
    }
  }

  goToFinalStep() {
    this.subscriptionPacakge = false;
    this.cardDetail = true;
  }

  payment() {
    if (!this.agreeToTerms.valid) {
      this.toastrService.error(
        "Please accept Terms & Conditions",
        "Terms & Conditions"
      );
      return;
    }
    return;
    if (
      this.cvc &&
      this.cardNumber &&
      this.cardname &&
      this.selectedMonth &&
      this.selectedMonth
    ) {
      let data = {
        cvc: this.cvc,
        number: this.cardNumber,
        exp_month: this.selectedMonth,
        exp_year: this.selectedYear,
      };

      this.userService.createStripeToken(data).subscribe({
        next: (value) => {
          let subscriptionData = {
            _id: this.user._id,
            email: this.user.email,
            name: this.user.companyName,
            token: value.id,
            firstName: this.firstName,
            lastName: this.lastName,
            country: this.country,
            postalCode: this.postalCode,
            phone: this.phone,
            priceId: this.priceId,
            free_trial: this.free_trial,
          };
          this.userService
            .createSubscriptionCustomer(subscriptionData)
            .subscribe({
              next: (res) => {
                console.log(res);
                let data = {
                  _id: this.user._id,
                  paymentMethodId: value.card.id,
                };
                this.userService.setPaymentMethodAsDefault(data).subscribe({
                  next: (value) => {},
                });

                if (this.isAfterSingup) {
                  const OBJ = {
                    userId: this.user._id,
                    purchaseAmount: this.total,
                  };

                  this.userService.affMakePurchase(OBJ).subscribe({
                    next: (value) => {},
                  });

                  this.toastrService.success(
                    "You have successfully subscribed."
                  );
                  this._router.navigate(["/pages/seller/home"]);
                  // this._router.navigate(['/login']);
                } else {
                  const OBJ = {
                    userId: this.user._id,
                    purchaseAmount: this.total,
                  };

                  this.userService.affMakePurchase(OBJ).subscribe({
                    next: (value) => {},
                  });

                  this.user["payment"] = true;
                  this._authenticationService.updateUserData(this.user);
                  this._router.navigate(["/pages/seller/home"]);
                }
              },
            });
        },
      });
    }
  }

  priceId = "price_1P3AMSL7MEQHcjwNsnSSUyQo";
  signupCost = "price_1P3APGL7MEQHcjwNZ94I8WJy";
  charges = "398.00";
  discount = "199.00";
  total = "199.00";
  free_trial = "0";
  selectPackage() {
    this.priceId = "price_1P3AMSL7MEQHcjwNsnSSUyQo";
    this.signupCost = "price_1P3APGL7MEQHcjwNZ94I8WJy";
    this.charges = "398.00";
    this.discount = "199.00";
    this.total = "199.00";
    this.free_trial = "0";
    // if (this.radioModel === 1) {
    //   this.priceId = "price_1NhaU9DmnN3Lb8U78yKEA2id";
    //   this.charges = "9.99";
    //   this.discount = "0.00";
    //   this.total = "9.99";
    //   this.free_trial = "1";
    // } else if (this.radioModel === 2) {
    //   this.priceId = "price_1NhaUqDmnN3Lb8U7IsN8Lc5u";
    //   this.charges = "8.25";
    //   this.discount = "20.88";
    //   this.total = "99.00";
    //   this.free_trial = "7";
    // } else {
    //   this.priceId = "price_1NhaUqDmnN3Lb8U7IsN8Lc5u";
    //   this.charges = "200.00";
    //   this.discount = "00.00";
    //   this.total = "200.00";
    //   this.free_trial = "7";
    // }
  }
}
