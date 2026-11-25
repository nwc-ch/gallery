import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  protected readonly ready = signal(false);
  protected readonly loading = signal(true);
  protected readonly error = signal(
    this.route.snapshot.queryParamMap.get('error') === 'google'
      ? 'Die Google-Anmeldung wurde abgebrochen oder ist fehlgeschlagen. Bitte versuche es erneut.'
      : '',
  );

  async ngOnInit(): Promise<void> {
    try {
      const config = await this.auth.config();
      this.ready.set(config.googleConfigured);
      if (!config.googleConfigured)
        this.error.set(
          'Die Google-Anmeldung ist derzeit nicht verfügbar. Bitte versuche es später erneut.',
        );
    } catch {
      this.error.set('Der Anmeldedienst ist gerade nicht erreichbar. Bitte lade die Seite erneut.');
    } finally {
      this.loading.set(false);
    }
  }
}
