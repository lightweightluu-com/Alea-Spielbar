import { icon } from '../../icons'
import { supabase } from '../supabaseClient'

interface ReservationRow {
  id: string
  name: string
  email: string
  anliegen_label: string
  date: string | null
  time: string | null
  people: number | null
  message: string
  status: 'new' | 'confirmed' | 'declined'
  created_at: string
}

const STATUS_LABELS: Record<ReservationRow['status'], string> = {
  new: 'Neu',
  confirmed: 'Bestätigt',
  declined: 'Abgelehnt',
}

function formatCreatedAt(iso: string): string {
  return new Date(iso).toLocaleString('de-CH', { dateStyle: 'medium', timeStyle: 'short' })
}

function statusSelect(row: ReservationRow): string {
  const options = (Object.keys(STATUS_LABELS) as ReservationRow['status'][])
    .map((value) => `<option value="${value}" ${value === row.status ? 'selected' : ''}>${STATUS_LABELS[value]}</option>`)
    .join('')
  return `<select data-status-select="${row.id}" class="form-input w-auto py-1.5 text-sm">${options}</select>`
}

function reservationRowHtml(row: ReservationRow): string {
  const details = [row.date, row.time, row.people ? `${row.people} Personen` : null].filter(Boolean).join(' · ')
  return `
  <div class="rounded-card border border-hairline bg-surface p-5" data-reservation-row="${row.id}">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="font-medium text-paper">${row.name} <span class="text-sm font-normal text-muted">— ${row.anliegen_label}</span></p>
        <p class="mt-1 text-xs text-muted">${formatCreatedAt(row.created_at)}${details ? ` · ${details}` : ''}</p>
        <a href="mailto:${row.email}" class="mt-1 inline-block text-xs text-brand-text hover:underline">${row.email}</a>
      </div>
      <div class="flex items-center gap-2">
        ${statusSelect(row)}
        <button
          type="button"
          data-delete-reservation="${row.id}"
          class="pressable inline-flex items-center gap-1.5 rounded-pill border border-hairline px-3 py-1.5 text-xs font-medium text-brand-text hover:bg-surface-2"
        >
          ${icon('trash', 'size-3.5')} Löschen
        </button>
      </div>
    </div>
    <p class="mt-3 max-w-[65ch] text-sm leading-relaxed text-paper">${row.message}</p>
  </div>`
}

export function renderReservationsList(): string {
  return `
  <h1 class="font-display text-2xl font-bold text-paper">Reservierungen</h1>
  <p class="mt-1 text-sm text-muted">Neueste zuerst. Status ändern, sobald ihr Bescheid gegeben habt.</p>

  <div id="reservations-status" class="mt-6 text-sm text-muted">Lädt …</div>
  <div id="reservations-body" class="mt-2 flex flex-col gap-4"></div>`
}

export async function setupReservationsList(): Promise<void> {
  const status = document.querySelector<HTMLDivElement>('#reservations-status')
  const body = document.querySelector<HTMLDivElement>('#reservations-body')
  if (!status || !body) return

  const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false })

  if (error) {
    status.textContent = `Fehler beim Laden: ${error.message}`
    return
  }

  const reservations = (data ?? []) as ReservationRow[]
  status.textContent = reservations.length ? `${reservations.length} Reservierungen` : ''
  body.innerHTML = reservations.length
    ? reservations.map(reservationRowHtml).join('')
    : '<p class="py-10 text-center text-muted">Noch keine Reservierungen eingegangen.</p>'

  body.querySelectorAll<HTMLSelectElement>('[data-status-select]').forEach((select) => {
    select.addEventListener('change', async () => {
      const id = select.dataset.statusSelect
      if (!id) return
      const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: select.value })
        .eq('id', id)
      if (updateError) window.alert(`Status konnte nicht gespeichert werden: ${updateError.message}`)
    })
  })

  body.querySelectorAll<HTMLButtonElement>('[data-delete-reservation]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.deleteReservation
      if (!id) return
      if (!window.confirm('Diese Reservierung wirklich löschen?')) return

      const { error: deleteError } = await supabase.from('reservations').delete().eq('id', id)
      if (deleteError) {
        window.alert(`Löschen fehlgeschlagen: ${deleteError.message}`)
        return
      }
      body.querySelector(`[data-reservation-row="${id}"]`)?.remove()
    })
  })
}
