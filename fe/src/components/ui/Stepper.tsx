interface StepperProps {
  id?: string;
  steps: string[];
  current: number; // 1-based
}

export function Stepper({ id, steps, current }: StepperProps) {
  return (
    <div id={id} className="stepper" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '24px', 
      margin: '24px 0',
      padding: '20px 0'
    }}>
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const active = stepNum === current;
        const completed = stepNum < current;
        return (
          <div key={label} id={`${id ? id + '-' : ''}step-${stepNum}`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <div
              className="step-number"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: active || completed ? 'var(--color-primary)' : 'var(--figma-gray-300)',
                color: active || completed ? '#fff' : 'var(--figma-gray-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 600,
                fontFamily: 'var(--font-family-primary)',
                transition: 'all 0.3s ease',
                boxShadow: active ? '0 2px 8px rgba(0, 144, 255, 0.3)' : 'none'
              }}
            >
              {stepNum}
            </div>
            <div 
              className="step-text" 
              style={{ 
                fontWeight: active ? 600 : 400,
                fontSize: '16px',
                fontFamily: 'var(--font-family-primary)',
                color: active ? 'var(--color-text-primary)' : 'var(--figma-gray-500)',
                transition: 'all 0.3s ease'
              }}
            >
              {label}
            </div>
            {stepNum !== steps.length && (
              <div 
                className="step-separator" 
                style={{ 
                  width: '60px', 
                  height: '2px', 
                  background: completed ? 'var(--color-primary)' : 'var(--figma-gray-300)', 
                  marginLeft: '12px',
                  borderRadius: '1px',
                  transition: 'all 0.3s ease'
                }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}


