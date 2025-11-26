interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'error' | 'info';
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getColorClasses = () => {
    if (type) {
      const typeMap = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-orange-100 text-orange-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
      };
      return typeMap[type];
    }

    const statusLower = status.toLowerCase();
    if (statusLower.includes('active') || statusLower.includes('success') || statusLower.includes('completed')) {
      return 'bg-green-100 text-green-800';
    }
    if (statusLower.includes('pending') || statusLower.includes('warning')) {
      return 'bg-orange-100 text-orange-800';
    }
    if (statusLower.includes('failed') || statusLower.includes('error') || statusLower.includes('expired') || statusLower.includes('suspended')) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getColorClasses()}`}>
      {status}
    </span>
  );
}
