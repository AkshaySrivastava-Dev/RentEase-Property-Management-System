/**
 * RentEase - Table Component
 * Reusable table renderer with column configurations and empty state handling.
 */

const Table = {
  /**
   * Generates HTML markup for a standard data table
   * @param {Object} config 
   * @param {Array} config.columns Array of { key, label, sortable, render?: fn(row) }
   * @param {Array} config.data Array of data objects
   * @param {string} [config.emptyMessage] Custom empty state message
   * @param {string} [config.emptyIcon] Icon or emoji for empty state
   * @returns {string} Table HTML
   */
  render(config) {
    const { columns, data = [], emptyMessage = 'No records found.', emptyIcon = '' } = config;

    if (!data || data.length === 0) {
      return `
        <div class="table-container">
          <div class="table-empty-state">
            <div class="empty-icon" style="display: flex; justify-content: center; margin-bottom: var(--space-3);">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-text-muted);">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="empty-title">No Records Found</div>
            <div class="empty-desc">${emptyMessage}</div>
          </div>
        </div>
      `;
    }

    const theadHtml = `
      <thead>
        <tr>
          ${columns.map(col => `
            <th class="${col.sortable ? 'sortable' : ''} ${col.align === 'right' ? 'text-right' : ''}" data-key="${col.key}">
              ${col.label}
              ${col.sortable ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 4px; vertical-align: middle;"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>' : ''}
            </th>
          `).join('')}
        </tr>
      </thead>
    `;

    const tbodyHtml = `
      <tbody>
        ${data.map(row => `
          <tr>
            ${columns.map(col => {
              const cellContent = col.render ? col.render(row) : (row[col.key] !== undefined ? row[col.key] : '—');
              const alignClass = col.align === 'right' ? 'text-right' : '';
              return `<td class="${alignClass}" data-label="${col.label}">${cellContent}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;

    return `
      <div class="table-container">
        <table class="data-table table-responsive-cards">
          ${theadHtml}
          ${tbodyHtml}
        </table>
      </div>
    `;
  }
};

