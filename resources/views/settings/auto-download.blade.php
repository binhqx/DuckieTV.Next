@php
    $enabled = settings('torrenting.autodownload', false);
    $periodHours = (int) settings('autodownload.period', 1);
    $delayMinutes = (int) settings('autodownload.delay', 15);
@endphp

<div class="buttons">
    <h2>
        <span title="{{ $enabled ? 'Enabled' : 'Disabled' }}">
            <i class="glyphicon {{ $enabled ? 'glyphicon-ok' : 'glyphicon-remove' }}"></i>
        </span>
        Auto-Download
    </h2>

    <p>{{ $enabled ? 'Auto-Download is active. DuckieTV will search for episodes on a schedule.' : 'Auto-Download is disabled. You must manually search for episodes.' }}</p>
    <p><strong>Current Setting:</strong> {{ $enabled ? 'Enabled' : 'Disabled' }}</p>

    <a href="javascript:void(0)"
       onclick="fetch('/settings/auto-download',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name=&quot;csrf-token&quot;]').getAttribute('content'),'X-Requested-With':'XMLHttpRequest'},body:JSON.stringify({'torrenting.autodownload':{{ $enabled ? 'false' : 'true' }}})}).then(() => window.SidePanel && window.SidePanel.expand('/settings/auto-download'));"
       class="btn btn-{{ $enabled ? 'danger' : 'success' }}">
        <i class="glyphicon {{ $enabled ? 'glyphicon-remove-sign' : 'glyphicon-cloud-download' }}"></i>
        {{ $enabled ? 'Disable Auto-Download' : 'Enable Auto-Download' }}
    </a>

    <hr class="setting-divider">

    <div class="autodownload">
        <h2>Check Frequency</h2>
        <p>DuckieTV checks for new episodes every <strong>{{ $periodHours }}</strong> hour(s).</p>

        <form data-section="auto-download" onsubmit="Settings.save('auto-download').then(() => window.SidePanel && window.SidePanel.expand('/settings/auto-download')); return false;">
            <input type="hidden" name="torrenting.autodownload" value="{{ $enabled ? 1 : 0 }}">
            <label for="autodownload_period_hours">Update Frequency (Hours):</label>
            <input id="autodownload_period_hours" type="number" name="autodownload.period" value="{{ $periodHours }}" min="1" max="168" required />
            <button class="btn btn-success btn-save" type="submit" style="float:right; margin-top:-10px;">
                <i class="glyphicon glyphicon-floppy-save"></i>&nbsp;<span>Save</span>
            </button>
        </form>

        <hr class="setting-divider">

        <h2>Auto-Download Delay</h2>
        <p>Wait before downloading to allow better quality releases.</p>

        <form data-section="auto-download" onsubmit="Settings.save('auto-download').then(() => window.SidePanel && window.SidePanel.expand('/settings/auto-download')); return false;">
            <input type="hidden" name="torrenting.autodownload" value="{{ $enabled ? 1 : 0 }}">
            <label for="autodownload_delay_minutes">Delay (Minutes):</label>
            <input id="autodownload_delay_minutes" type="number" name="autodownload.delay" value="{{ $delayMinutes }}" min="0" max="10080" required />
            <button class="btn btn-success btn-save" type="submit" style="float:right; margin-top:-10px;">
                <i class="glyphicon glyphicon-floppy-save"></i>&nbsp;<span>Save</span>
            </button>
        </form>
    </div>
</div>
