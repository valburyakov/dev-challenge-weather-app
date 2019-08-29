import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Observable, Observer, of, Subject } from 'rxjs';
import { CityModel } from '../models/city.model';
import { ungzip } from 'pako';

@Injectable({
  providedIn: 'root'
})
export class CityListService {

  private loadingSubject = new Subject<boolean>();

  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCitiesList() {
    return this.http.get('/assets/city.list.json.gz', { responseType: 'blob' }).pipe(
      tap(() => this.loadingSubject.next(true)),
      switchMap(blob => {
        const fileReader = new FileReader();
        const observable: Observable<CityModel[]> = Observable.create((observer: Observer<CityModel[]>) => {
          fileReader.onload = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;
            try {
              const result = ungzip(new Uint8Array(arrayBuffer), {to: 'string'});
              const obj = JSON.parse(result);
              observer.next(obj);
              observer.complete();
            } catch (err) {
              observer.error('Error ' + err);
            }
          };
        });

        fileReader.readAsArrayBuffer(blob);

        return observable.pipe(
          finalize(() => this.loadingSubject.next(false)),
        );
      }),
      catchError(err => of([])),
      shareReplay(1)
    );
  }

}
