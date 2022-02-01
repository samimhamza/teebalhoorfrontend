<template>
  <div class="mt-3">
    <v-row class="ma-0 px-2">
      <v-col cols="12" md="6" class="py-0 px-2">
        <div class="custom-card">
          <div class="custom-card-header py-2 px-2">
            <h3 class="">{{ $tr("job_description") }}</h3>
          </div>
          <div class="custom-card-body pa-2">
            <h4 class="ma-0">{{ $tr("job_description") }}</h4>
            <div class="job-desc px-2 py-3">
              <p class="text-h5 mb-1">Job brief</p>
              <p>
                We are seeking a Software Engineer to execute the full lifecycle
                of the product development, by programming well-designed,
                efficient, and testable code that meets specifications.
              </p>
              <p class="text-h5 mb-1">Responsibilities</p>
              <ul class="ps-4">
                <li>
                  Develop new capabilities and re-architect parts of an existing
                  system.
                </li>
                <li>
                  Take part in test-driven, iterative development, prototyping,
                  and reviews with a team of developers.
                </li>
                <li>
                  Design and code middle and back-end in a clean and efficient
                  way.
                </li>
                <li>Implement scalable and robust services.</li>
                <li>Develop external and internal APIs.</li>
                <li>
                  Develop and run unit and performance tests to ensure
                  scalability and reliability.
                </li>
              </ul>
              <p class="text-h5 mb-1">Responsibilities</p>
              <ul class="ps-4">
                <li>
                  Develop new capabilities and re-architect parts of an existing
                  system.
                </li>
                <li>
                  Take part in test-driven, iterative development, prototyping,
                  and reviews with a team of developers.
                </li>
                <li>
                  Design and code middle and back-end in a clean and efficient
                  way.
                </li>
                <li>Implement scalable and robust services.</li>
                <li>Develop external and internal APIs.</li>
                <li>
                  Develop and run unit and performance tests to ensure
                  scalability and reliability.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="py-0 px-2">
        <div class="custom-card">
          <div class="custom-card-header py-2 px-2">
            <h3>{{ $tr("job_details") }}</h3>
          </div>
          <div class="custom-card-body pa-2">
            <table class="w-full job-detail-table">
              <tr>
                <td>{{ $tr("job_reference") }}</td>
                <td>7XY8485</td>
              </tr>
              <tr>
                <td>{{ $tr("position_name") }}</td>
                <td>Software Engineer</td>
              </tr>
              <tr>
                <td>{{ $tr("job_location") }}</td>
                <td>Afghanistan</td>
              </tr>
              <tr>
                <td>{{ $tr("remote") }}</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>{{ $tr("office_address") }}</td>
                <td>Kabul, Afghanistan</td>
              </tr>
              <tr>
                <td>{{ $tr("headcount") }}</td>
                <td>3</td>
              </tr>
              <tr>
                <td>{{ $tr("experience_level") }}</td>
                <td>Senior</td>
              </tr>
              <tr>
                <td>{{ $tr("expected_close_date") }}</td>
                <td>2022-01-22</td>
              </tr>
              <tr>
                <td>{{ $tr("minimum_salary") }}</td>
                <td>1000</td>
              </tr>
              <tr>
                <td>{{ $tr("maximum_salary") }}</td>
                <td>2000</td>
              </tr>
              <tr>
                <td>{{ $tr("currency") }}</td>
                <td>USD</td>
              </tr>
              <tr>
                <td>{{ $tr("frequency") }}</td>
                <td>Mountly</td>
              </tr>
              <tr>
                <td>{{ $tr("contract_details") }}</td>
                <td>Full Time</td>
              </tr>
              <tr>
                <td>{{ $tr("open_date") }}</td>
                <td>2022-01-24</td>
              </tr>
              <tr>
                <td>{{ $tr("close_date") }}</td>
                <td>2022-01-13</td>
              </tr>
              <tr>
                <td>{{ $tr("job_industry") }}</td>
                <td>Charity / Social Services</td>
              </tr>
            </table>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.custom-card-header {
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  background: var(--stepper-header-bg) !important;
}
.custom-card-body {
  border: 1px solid rgba(220, 220, 220, 0.5);
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
  border-top: 0;
}
.custom-card-body .job-desc {
  border: 1px solid rgba(220, 220, 220, 0.5);
  border-radius: 8px;
}
.job-desc {
  line-height: 1.7 !important;
}
.job-detail-table tr td {
  padding: 8px 16px;
}
.job-detail-table tr td:first-child {
  font-weight: 600;
}
</style>
