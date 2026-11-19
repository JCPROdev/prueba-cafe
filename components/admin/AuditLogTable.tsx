export interface AuditLogRow {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  createdAt: Date;
  user: { name: string; email: string };
}

export function AuditLogTable({ logs }: { logs: AuditLogRow[] }) {
  if (logs.length === 0) {
    return <p className="text-neutral-600">No hay registros para estos filtros.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-neutral-200 text-neutral-500">
        <tr>
          <th className="py-2">Fecha</th>
          <th>Usuario</th>
          <th>Acción</th>
          <th>Entidad</th>
          <th>Detalle</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr key={log.id} className="border-b border-neutral-100 align-top">
            <td className="whitespace-nowrap py-2">
              {log.createdAt.toLocaleString("es-MX")}
            </td>
            <td>
              <span className="font-medium">{log.user.name}</span>
              <br />
              <span className="text-xs text-neutral-500">{log.user.email}</span>
            </td>
            <td>{log.action}</td>
            <td>{log.entity}</td>
            <td>{log.details ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
