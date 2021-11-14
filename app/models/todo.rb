class Todo < ApplicationRecord
  scope :filter_by_status, -> (status) { where done: status }
end
