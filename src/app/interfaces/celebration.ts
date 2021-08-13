import { Activity } from './activity';

export interface Celebration {
  activities: Activity[];
  description: string;
  idCelebration: string;
  image: string;
  name: string;
  reference: string;
  state: boolean;
}
