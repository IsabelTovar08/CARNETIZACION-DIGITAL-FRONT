export interface CityCreate{
  id: number;
  name: string;
  deparmentId: number;
}
export interface CityList extends CityCreate{
  deparmentName: string;
}
export interface Deparment{
  id: number;
  name: string;
}
