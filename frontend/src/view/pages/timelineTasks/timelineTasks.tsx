import { ProjectFiltersWithUrl } from '@view/pieces';

const TimelineTasks = () => {
  return (
    <div className="w-full h-full flex gap-2">
      <ProjectFiltersWithUrl updateDataCallback={() => {}} />
    </div>
  );
};

export default TimelineTasks;
