interface StepperProps {
  id?: string;
  steps: string[];
  current: number; // 1-based
}

export function Stepper({ id, steps, current }: StepperProps) {
  return (
    <div id={id} className="stepper" style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '16px 0' }}>
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const active = stepNum === current;
        const completed = stepNum < current;
        return (
          <div key={label} id={`${id ? id + '-' : ''}step-${stepNum}`} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              className="step-number"
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: active || completed ? 'var(--color-primary)' : '#d9d9d9',
                color: active || completed ? '#fff' : '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {stepNum}
            </div>
            <div className="step-text" style={{ fontWeight: active ? 600 : 400 }}>{label}</div>
            {stepNum !== steps.length && <div className="step-separator" style={{ width: 60, height: 1, background: completed ? 'var(--color-primary)' : '#a4a4a4', marginLeft: 8 }} />}
          </div>
        );
      })}
    </div>
  );
}


