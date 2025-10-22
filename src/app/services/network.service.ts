import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Network, ConnectionStatus } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  private status$ = new BehaviorSubject<boolean>(true);
  private listenerHandle: any;

  constructor(private zone: NgZone) {
    this.initNetworkListener();
  }

  private async initNetworkListener() {
    try {
      const status: ConnectionStatus = await Network.getStatus();
      this.updateStatus(status.connected);

      // Add listener for status changes
      this.listenerHandle = await Network.addListener('networkStatusChange', (status) => {
        this.updateStatus(status.connected);
      });
    } catch (error) {
      console.error('Error initializing network listener:', error);
    }
  }

  private updateStatus(connected: boolean) {
    // Always run inside Angular zone for proper change detection
    this.zone.run(() => {
      this.status$.next(connected);
    });
  }

  get networkStatus$(): Observable<boolean> {
    // Use distinctUntilChanged to avoid duplicate emissions
    return this.status$.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  get isOnline(): boolean {
    return this.status$.value;
  }

  async getCurrentStatus(): Promise<boolean> {
    try {
      const status = await Network.getStatus();
      return status.connected;
    } catch (error) {
      console.error('Error getting network status:', error);
      return true;
    }
  }

  ngOnDestroy() {
    // Clean up listener
    if (this.listenerHandle) {
      this.listenerHandle.remove();
    }
  }
}