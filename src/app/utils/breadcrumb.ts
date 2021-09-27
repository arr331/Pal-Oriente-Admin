import { BehaviorSubject } from "rxjs";

export class BreadPath {
    path: string;
    name: string;
}

export class BreadPaths {
    static default: BreadPath[] = [
        { path: 'regiones', name: 'Inicio' }
    ]

    static municipality: BreadPath[] = [
        ...BreadPaths.default, 
        { path: 'municipios', name: 'Municipios' },
    ]

    static sites: BreadPath[] = [
        ...BreadPaths.municipality, 
        { path: 'sitios', name: 'Sitios' },
    ]

    static celebration: BreadPath[] = [
        ...BreadPaths.municipality, 
        { path: 'celebraciones', name: 'Celebraciones' },
    ]

    static news: BreadPath[] = [
        ...BreadPaths.default, 
        { path: 'noticias', name: 'Noticias' },
    ]
}

export class Breadcrumb {
    static paths: BehaviorSubject<BreadPath[]> = new BehaviorSubject<BreadPath[]>(BreadPaths.default)
}



